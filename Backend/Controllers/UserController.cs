using Microsoft.AspNetCore.Mvc;
using backend.Common;
using backend.Models;
using backend.Helpers;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserHelper _userHelper;

        public UserController(UserHelper userHelper)
        {
            _userHelper = userHelper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.Fail("Invalid user data"));

            try
            {
                var (createdUser, jwtToken) = await _userHelper.CreateUserAsync(user, Response);
                return Ok(ApiResponse<object>.Ok(new { userId = createdUser.UserId }, "User created successfully"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> UserLogin([FromBody] UserLoginDTO loginRequest)
        {
            if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password))
                return BadRequest(ApiResponse<string>.Fail("Email and password are required"));

            var (loggedInUser, jwtToken) = await _userHelper.LoginAsync(loginRequest.Email, loginRequest.Password, Response);
            if (loggedInUser == null || jwtToken == null)
                return Unauthorized(ApiResponse<string>.Fail("Invalid email or password"));

            return Ok(ApiResponse<object>.Ok(new { userId = loggedInUser.UserId, token = jwtToken }, "Login successful"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userHelper.GetUserByIdAsync(id);
            if (user == null) return NotFound(ApiResponse<string>.Fail("User not found"));
            return Ok(ApiResponse<User>.Ok(user));
        }
        //update
        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token))
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Token not found"));

            var userIdFromToken = _userHelper.ValidateToken(token);
            if (userIdFromToken == null)
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Invalid token"));

            if (userIdFromToken != id)
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<string>.Fail("You can only update your own account"));

            await _userHelper.UpdateUserAsync(id, dto);
            var updatedUser = await _userHelper.GetUserByIdAsync(id);

            return Ok(ApiResponse<User>.Ok(updatedUser!, "User updated successfully"));
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Check if JWT cookie exists
            if (!Request.Cookies.TryGetValue("jwtToken", out var token))
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Token not found"));

            // Validate token and get userId
            var userIdFromToken = _userHelper.ValidateToken(token);
            if (userIdFromToken == null)
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Invalid token"));

            // Fetch user info
            var user = await _userHelper.GetUserByIdAsync(userIdFromToken.Value);
            if (user == null)
                return NotFound(ApiResponse<string>.Fail("User not found"));

            return Ok(ApiResponse<User>.Ok(user, "Profile retrieved successfully"));
        }


        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token))
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Token not found"));

            var userIdFromToken = _userHelper.ValidateToken(token);
            if (userIdFromToken == null)
                return new UnauthorizedObjectResult(ApiResponse<string>.Fail("Invalid token"));

            if (userIdFromToken != id)
                return StatusCode(StatusCodes.Status403Forbidden, ApiResponse<string>.Fail("You can only delete your own account"));

            await _userHelper.DeleteUserAsync(id);
            return Ok(ApiResponse<string>.Ok("User deleted successfully"));
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Remove the JWT cookie by setting an expired cookie
            Response.Cookies.Append("jwtToken", "",
                new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(-1),
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

            return Ok(ApiResponse<string>.Ok("Logged out successfully"));
        }


    }
}
