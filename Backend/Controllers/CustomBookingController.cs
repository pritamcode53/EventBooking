using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Helpers;
using backend.DTOs.CustomBooking;
using backend.Common.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/custom-bookings")]
    [Authorize] // Require authentication
    public class CustomBookingController : ControllerBase
    {
        private readonly CustomBookingHelper _customBookingHelper;
        private readonly UserHelper _userHelper;

        public CustomBookingController(CustomBookingHelper customBookingHelper, UserHelper userHelper)
        {
            _customBookingHelper = customBookingHelper;
            _userHelper = userHelper;
        }

        // ---------------- Helper Function ----------------

        private int? GetUserIdFromToken()
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token))
                return null;

            return _userHelper.ValidateToken(token);
        }

        // ---------------- Endpoints ----------------

        /// <summary>
        /// ✅ Create a new custom booking request
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateCustomBooking([FromBody] CustomBookingCreateDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            if (dto == null || string.IsNullOrWhiteSpace(dto.Requirements))
                return BadRequest(new { Message = "Invalid booking request data" });

            var bookingId = await _customBookingHelper.CreateCustomBookingAsync(dto, userId.Value);
            return Ok(new { RequestId = bookingId, Message = "Custom booking request created successfully" });
        }

        /// <summary>
        /// ✅ Get all custom booking requests for the logged-in user
        /// </summary>
        [HttpGet("my-requests")]
        public async Task<IActionResult> GetMyCustomBookings()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var bookings = await _customBookingHelper.GetCustomBookingsByUserAsync(userId.Value);
            return Ok(bookings);
        }

        [Authorize]
        [HttpGet("all-requests")]
        public async Task<IActionResult> GetAllCustomBookingRequests()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var user = await _userHelper.GetUserByIdAsync(userId.Value);
            if (user == null || (user.Role != UserRole.Admin && user.Role != UserRole.VenueOwner))
                return Forbid("Only Admin or Venue Owner can view all custom booking requests.");

            var requests = await _customBookingHelper.GetAllCustomBookingsAsync();
            return Ok(requests);
        }


        [Authorize]
        [HttpPut("update-price/{bookingId:int}")]
        public async Task<IActionResult> UpdateBookingPrice(int bookingId, [FromBody] UpdatePriceDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var user = await _userHelper.GetUserByIdAsync(userId.Value);
            if (user == null || (user.Role != UserRole.Admin && user.Role != UserRole.VenueOwner))
                return Forbid("Only Admin or Venue Owner can modify booking price.");

            if (dto.NewPrice <= 0)
                return BadRequest(new { Message = "Invalid price value." });

            var success = await _customBookingHelper.UpdateBookingPriceAsync(bookingId, dto.NewPrice, dto.OwnerReview ?? string.Empty);

            if (!success)
                return NotFound(new { Message = "Booking not found." });

            return Ok(new { Message = "Booking price updated successfully." });
        }


        /// <summary>
        /// ✅ Get details of a specific custom booking request by ID
        /// </summary>
        [HttpGet("{requestId:int}")]
        public async Task<IActionResult> GetCustomBookingById(int requestId)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var booking = await _customBookingHelper.GetCustomBookingByIdAsync(requestId);
            if (booking == null)
                return NotFound(new { Message = "Custom booking request not found" });


            return Ok(booking);
        }

        /// <summary>
        /// ✅ Delete a custom booking request
        /// </summary>
        [HttpDelete("{requestId:int}/delete")]
        public async Task<IActionResult> DeleteCustomBooking(int requestId)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var success = await _customBookingHelper.DeleteCustomBookingAsync(requestId, userId.Value);

            if (!success)
                return NotFound(new { Message = "Custom booking request not found or already deleted" });

            return Ok(new { Message = "Custom booking request deleted successfully" });
        }

        [HttpPut("{requestId:int}/approve")]
        public async Task<IActionResult> ApproveCustomBooking(int requestId, [FromBody] ApproveCustomBookingDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            var success = await _customBookingHelper.UpdateUserApprovalAsync(requestId, dto.IsApproved);

            if (!success)
                return NotFound(new { Message = "Custom booking not found or update failed." });

            var message = dto.IsApproved
                ? "✅ Custom booking approved successfully."
                : "❌ Custom booking rejected.";

            return Ok(new { Message = message });
        }


    }
}
