using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Common.Enums;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize] // Require authentication for all routes
    public class AdminController : ControllerBase
    {
        private readonly AdminHelper _adminHelper;
        private readonly UserHelper _userHelper;

        public AdminController(AdminHelper adminHelper, UserHelper userHelper)
        {
            _adminHelper = adminHelper;
            _userHelper = userHelper;
        }

        // ---------------- Helper Functions ----------------

        private int? GetUserIdFromToken()
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token))
                return null;

            return _userHelper.ValidateToken(token);
        }

        private async Task<int> GetAuthenticatedAdminIdAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                throw new UnauthorizedAccessException("User not authenticated");

            var user = await _userHelper.GetUserByIdAsync(userId.Value);
            if (user == null || user.Role != UserRole.Admin)
                throw new UnauthorizedAccessException("Only admins can perform this action");

            return userId.Value;
        }

        // ---------------- Admin Endpoints ----------------

        [HttpGet("owners")]
        public async Task<IActionResult> GetOwners()
        {
            await GetAuthenticatedAdminIdAsync(); // ✅ Verify admin via token

            var owners = await _adminHelper.GetAllOwnersAsync();
            return Ok(owners);
        }

        [HttpGet("venues")]
        public async Task<IActionResult> GetVenues()
        {
            await GetAuthenticatedAdminIdAsync(); // ✅ Verify admin via token

            var venues = await _adminHelper.GetAllVenuesAsync();
            return Ok(venues);
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings([FromQuery] string? status = null)
        {
            await GetAuthenticatedAdminIdAsync(); // ✅ Verify admin via token

            var bookings = string.IsNullOrEmpty(status)
                ? await _adminHelper.GetAllBookingsAsync()
                : await _adminHelper.GetBookingsByStatusAsync(status);

            var totalCost = await _adminHelper.GetTotalBookingCostAsync();
            var totalBookings = await _adminHelper.GetTotalBookingsCountAsync();

            return Ok(new
            {
                TotalBookings = totalBookings,
                TotalCost = totalCost,
                Bookings = bookings
            });
        }

        [HttpGet("bookings/{id:int}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            await GetAuthenticatedAdminIdAsync(); // ✅ Verify admin via token

            var booking = await _adminHelper.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound(new { Message = "Booking not found" });

            return Ok(booking);
        }
        // GET: api/admin/analytics/total-cost
        [HttpGet("analytics/total-cost")]
        public async Task<IActionResult> GetTotalBookingCost()
        {
            // Verify admin
            await GetAuthenticatedAdminIdAsync();

            var totalCost = await _adminHelper.GetTotalBookingCostAsync();
            return Ok(new { TotalCost = totalCost });
        }

        // GET: api/admin/analytics/total-bookings
        [HttpGet("analytics/total-bookings")]
        public async Task<IActionResult> GetTotalBookingsCount()
        {
            // Verify admin
            await GetAuthenticatedAdminIdAsync();

            var totalBookings = await _adminHelper.GetTotalBookingsCountAsync();
            return Ok(new { TotalBookings = totalBookings });
        }
    }
}
