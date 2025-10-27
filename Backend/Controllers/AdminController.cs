using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Common.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;

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
            // ✅ Extract JWT token from cookie
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

        // ✅ Get paginated bookings (with optional status filter)
        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings(
            [FromQuery] string? status = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            await GetAuthenticatedAdminIdAsync();

            IEnumerable<BookingDto> bookings;
            int totalCount;

            // ✅ Handle pagination properly
            if (string.IsNullOrEmpty(status))
            {
                (bookings, totalCount) = await _adminHelper.GetAllBookingsAsync(pageNumber, pageSize);
            }
            else
            {
                // Optional: Implement if needed
                (bookings, totalCount) = await _adminHelper.GetBookingsByStatusAsync(status, pageNumber, pageSize);
            }

            var totalCost = await _adminHelper.GetTotalBookingCostAsync();
            var totalBookings = await _adminHelper.GetTotalBookingsCountAsync();

            return Ok(new
            {
                TotalBookings = totalBookings,
                TotalCost = totalCost,
                Bookings = bookings,
                Pagination = new
                {
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                }
            });
        }

        [HttpGet("bookings/{id:int}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            await GetAuthenticatedAdminIdAsync();

            var booking = await _adminHelper.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound(new { Message = "Booking not found" });

            return Ok(booking);
        }

        // ✅ Analytics: total booking cost
        [HttpGet("analytics/total-cost")]
        public async Task<IActionResult> GetTotalBookingCost()
        {
            await GetAuthenticatedAdminIdAsync();

            var totalCost = await _adminHelper.GetTotalBookingCostAsync();
            return Ok(new { TotalCost = totalCost });
        }
         [HttpGet("analytics/total-due")]
        public async Task<IActionResult> GetTotalDue()
        {
            await GetAuthenticatedAdminIdAsync();

            var totalDue = await _adminHelper.GetTotalDueAmount();
            return Ok(new { TotalDue = totalDue });
        }

        // ✅ Analytics: total bookings count
        [HttpGet("analytics/total-bookings")]
        public async Task<IActionResult> GetTotalBookingsCount()
        {
            await GetAuthenticatedAdminIdAsync();

            var totalBookings = await _adminHelper.GetTotalBookingsCountAsync();
            return Ok(new { TotalBookings = totalBookings });
        }

        // ✅ Analytics: total cancelled bookings
        [HttpGet("analytics/cancel")]
        public async Task<IActionResult> GetTotalCancelAsync()
        {
            await GetAuthenticatedAdminIdAsync();

            var totalCancel = await _adminHelper.GetTotalCancelBookingAsync();
            return Ok(new { TotalCancelledBookings = totalCancel });
        }

        // ✅ Full details of cancelled bookings
        [HttpGet("details-cancel")]
        public async Task<IActionResult> GetCancelDetails()
        {
            await GetAuthenticatedAdminIdAsync();

            var cancelDetails = await _adminHelper.GetAllCancelBooking();
            return Ok(new { cancelDetails });
        }
    }
}
