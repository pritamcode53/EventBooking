using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Common.Enums;
using backend.Models;
using backend.DAL;
using backend.Services;
using backend.DTOs;

namespace backend.Helpers
{
    public class UserHelper
    {
        private readonly UserDAL _userDAL;
        private readonly JwtService _jwtService;

        public UserHelper(UserDAL userDAL, JwtService jwtService)
        {
            _userDAL = userDAL;
            _jwtService = jwtService;
        }

        // Wrapper for token validation
        public int? ValidateToken(string token) => _jwtService.ValidateToken(token);

        // ------------------ Create/Register User ------------------
        public async Task<(User, string?)> CreateUserAsync(User user, HttpResponse? response = null)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            if (!Enum.TryParse<UserRole>(user.Role.ToString(), true, out var parsedRole))
                throw new ArgumentException("Invalid role");
            user.Role = parsedRole;

            if (string.IsNullOrWhiteSpace(user.PasswordHash))
                throw new ArgumentException("Password cannot be empty");
            user.PasswordHash = HashPassword(user.PasswordHash);

            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            var id = await _userDAL.AddUserAsync(user);
            user.UserId = id;

            var jwtToken = _jwtService.GenerateJwtToken(user);

            if (response != null) _jwtService.SetJwtCookie(response, jwtToken);

            return (user, jwtToken);
        }

        // ------------------ Login ------------------
        public async Task<(User?, string?)> LoginAsync(string email, string password, HttpResponse? response = null)
        {
            var user = await _userDAL.GetUserByEmailAsync(email);
            if (user == null || string.IsNullOrEmpty(user.PasswordHash)) return (null, null);

            if (!VerifyPassword(password, user.PasswordHash)) return (null, null);

            var jwtToken = _jwtService.GenerateJwtToken(user);
            if (response != null) _jwtService.SetJwtCookie(response, jwtToken);

            return (user, jwtToken);
        }

        // ------------------ Update User ------------------
        public async Task UpdateUserAsync(int id, UserUpdateDto dto)
        {
            var existingUser = await _userDAL.GetUserByIdAsync(id);
            if (existingUser == null) throw new ArgumentException("User not found");

            existingUser.Name = dto.Name ?? existingUser.Name;
            existingUser.Email = dto.Email ?? existingUser.Email;

            if (!string.IsNullOrEmpty(dto.Password))
                existingUser.PasswordHash = HashPassword(dto.Password);

            if (dto.Role.HasValue)
                existingUser.Role = dto.Role.Value;

            existingUser.UpdatedAt = DateTime.UtcNow;

            await _userDAL.UpdateUserAsync(existingUser);
        }

        // ------------------ Delete User ------------------
        public async Task DeleteUserAsync(int id)
        {
            var existingUser = await _userDAL.GetUserByIdAsync(id);
            if (existingUser == null) throw new ArgumentException("User not found");

            await _userDAL.DeleteUserAsync(id);
        }

        // ------------------ Get User by Id ------------------
        public async Task<User?> GetUserByIdAsync(int id) => await _userDAL.GetUserByIdAsync(id);

        // ------------------ Password Hash ------------------
        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }

        public bool VerifyPassword(string password, string? storedHash)
        {
            if (string.IsNullOrEmpty(storedHash)) return false;
            var hash = HashPassword(password);
            return hash == storedHash;
        }
    }
}
