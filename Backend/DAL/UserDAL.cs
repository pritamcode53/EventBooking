using System.Data;
using Dapper;
using backend.Models;

namespace backend.DAL
{
    public class UserDAL
    {
        private readonly IDbConnection _db;

        public UserDAL(IDbConnection db)
        {
            _db = db;
        }

        // ---------------------- Create ----------------------
        public async Task<int> AddUserAsync(User user)
        {
            var sql = @"
                INSERT INTO users (name, email, passwordhash, role, createdat, updatedat)
                VALUES (@Name, @Email, @PasswordHash, @Role, @CreatedAt, @UpdatedAt)
                RETURNING userid;
            ";

            var parameters = new
            {
                Name = user.Name,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteScalarAsync<int>(sql, parameters);
        }

        // ---------------------- Read by ID ----------------------
        public async Task<User?> GetUserByIdAsync(int id)
        {
            var sql = "SELECT * FROM users WHERE userid = @Id";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        // ---------------------- Read by Email ----------------------
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var sql = "SELECT * FROM users WHERE email = @Email";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
        }

        // ---------------------- Read All ----------------------
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var sql = "SELECT * FROM users ORDER BY userid";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QueryAsync<User>(sql);
        }

        // ---------------------- Update ----------------------
        public async Task<int> UpdateUserAsync(User user)
        {
            var sql = @"
                UPDATE users
                SET name = @Name,
                    email = @Email,
                    passwordhash = @PasswordHash,
                    updatedat = @UpdatedAt
                WHERE userid = @UserId;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, user);
        }

        // ---------------------- Delete ----------------------
        public async Task<int> DeleteUserAsync(int id)
        {
            var sql = "DELETE FROM users WHERE userid = @Id";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new { Id = id });
        }
    }
}
