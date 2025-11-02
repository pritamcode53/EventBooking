using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.DTOs;
using backend.Common.Enums;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using QuestPDF.Helpers;
using QuestPDF.Fluent;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly BookingHelper _helper;
        private readonly UserHelper _userHelper;
        private readonly VenueHelper _venueHelper;

        public BookingController(BookingHelper helper, UserHelper userHelper, VenueHelper venueHelper)
        {
            _helper = helper;
            _userHelper = userHelper;
            _venueHelper = venueHelper;
        }

        // ---------------- Helper ----------------
        private int? GetUserIdFromToken()
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token)) return null;
            return _userHelper.ValidateToken(token);
        }

        private async Task<int> GetAuthenticatedOwnerIdAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                throw new UnauthorizedAccessException("User not authenticated");

            var user = await _userHelper.GetUserByIdAsync(userId.Value);
            if (user == null || user.Role != UserRole.VenueOwner)
                throw new UnauthorizedAccessException("Only venue owners can perform this action");

            return userId.Value;
        }

        private async Task<bool> IsVenueOwnerAsync(int userId)
        {
            var user = await _userHelper.GetUserByIdAsync(userId);
            return user != null && user.Role == UserRole.VenueOwner;
        }

        // ---------------- Customer APIs ----------------
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authorized" });

            try
            {
                var bookingId = await _helper.CreateBookingAsync(dto, userId.Value);
                return Ok(new
                {
                    BookingId = bookingId,
                    Message = "Booking request created successfully"
                });
            }
            catch (Exception ex)
            {
                // Here you catch "Venue not found", "Venue not available", etc.
                return BadRequest(new { Message = ex.Message });
            }
        }


        [Authorize]
        [HttpPost("{bookingId}/cancel")]
        public async Task<IActionResult> CancelBooking(int bookingId, [FromBody] CancelBookingRequest request)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.CancelReason))
                return BadRequest("Cancellation reason is required.");

            await _helper.CancelBookingAsync(bookingId, userId.Value, request.CancelReason);

            return Ok(new { message = "Booking cancelled successfully" });
        }


        [Authorize]
        [HttpGet("mybookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var bookings = await _helper.GetCustomerBookingsAsync(userId.Value);
            return Ok(bookings);
        }

        [Authorize]
        [HttpGet("checkavailability")]
        public async Task<IActionResult> CheckAvailability([FromQuery] int venueId, [FromQuery] DateTime date, [FromQuery] int hours)
        {
            var available = await _helper.IsVenueAvailableAsync(venueId, date, hours);
            return Ok(new { VenueId = venueId, Available = available });
        }

        // ---------------- Owner APIs ----------------
        [Authorize]
        [HttpPatch("owner/booking/{bookingId}/status")]
        public async Task<IActionResult> UpdateBookingStatusByOwner(int bookingId, [FromBody] UpdateBookingStatusDto dto)
        {
            if (dto.Status == null) return BadRequest("Status is required");

            int ownerId = await GetAuthenticatedOwnerIdAsync();

            var result = await _helper.UpdateBookingStatusByOwnerAsync(bookingId, ownerId, dto.Status.Value);
            if (result == 0)
                return BadRequest("Booking not found or you are not authorized");

            return Ok("Booking status updated successfully");
        }

        [Authorize]
        [HttpGet("owner/bookings/pending")]
        public async Task<IActionResult> GetPendingBookingsForOwner()
        {
            int ownerId = await GetAuthenticatedOwnerIdAsync();
            var bookings = await _helper.GetPendingBookingsForOwnerAsync(ownerId);
            return Ok(bookings);
        }

        [Authorize]
        [HttpGet("owner/bookings/approved")]
        public async Task<IActionResult> GetApprovedBookingsForOwner()
        {
            int ownerId = await GetAuthenticatedOwnerIdAsync();
            var bookings = await _helper.GetApprovedBookingsByOwnerAsync(ownerId);
            return Ok(bookings);
        }

        // [Authorize]
        // [HttpGet("owner/bookings")]
        // public async Task<IActionResult> GetBookingsByStatus([FromQuery] BookingStatus status)
        // {
        //     int ownerId = await GetAuthenticatedOwnerIdAsync();
        //     var bookings = await _helper.GetBookingsByOwnerAndStatusAsync(ownerId, status);
        //     return Ok(bookings);
        // }

        // ---------------- Admin Add Multiple Pricing ----------------
        [Authorize]
        [HttpPost("admin/venue/{venueId}/pricing/add")]
        public async Task<IActionResult> AddVenuePricing(int venueId, [FromBody] List<VenuePricingDto> pricings)
        {
            if (pricings == null || !pricings.Any())
                return BadRequest("No pricing data provided");

            int ownerId = await GetAuthenticatedOwnerIdAsync();

            foreach (var p in pricings)
            {
                var pricing = new VenuePricing
                {
                    VenueId = venueId,
                    Type = (PricingType)p.Type,
                    Price = p.Price,
                    CreatedAt = DateTime.UtcNow
                };

                await _venueHelper.AddVenuePricingAsync(pricing, ownerId);
            }

            return Ok("Venue pricing added successfully");
        }

        // [Authorize]
        // [HttpPut("venue/{venueId}/pricing/update")]
        // public async Task<IActionResult> UpdateVenuePricing(int venueId, [FromBody] List<VenuePricingUpdateDto> pricings)
        // {
        //     if (pricings == null || !pricings.Any())
        //         return BadRequest("No pricing data provided");

        //     int ownerId = await GetAuthenticatedOwnerIdAsync();
        //     int successCount = 0;

        //     foreach (var p in pricings)
        //     {
        //         // Update by venueId + type
        //         var result = await _venueHelper.UpdateVenuePricingAsync(
        //             venueId,      // the venue ID
        //             p.Type,       // PricingType from your DTO
        //             p.Price,      // new price
        //             ownerId       // THIS was missing
        //         );

        //         Console.WriteLine($"Updating VenueId: {venueId}, Type: {p.Type}, Price: {p.Price}");

        //         if (result > 0)
        //             successCount++;
        //     }

        //     return Ok(new
        //     {
        //         message = $"{successCount} venue pricing record(s) updated successfully",
        //         totalRequested = pricings.Count
        //     });
        // }



        [Authorize]
        [HttpGet("{bookingId}/invoice")]
        [Obsolete]

        public async Task<IActionResult> GetInvoice(int bookingId)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "User not authenticated" });

            // Fetch booking
            var booking = await _helper.GetBookingByIdAsync(bookingId);
            if (booking == null)
                return NotFound(new { Message = "Booking not found" });
            Console.WriteLine($"🔍 Checking access: booking.CustomerId={booking.CustomerId}, userId={userId}");
            // Ensure user is owner of this booking
            if (booking.CustomerId != userId)
                return StatusCode(403, new { Message = "You are not authorized to view this invoice." });
            // Generate Invoice PDF
            var pdf = GenerateInvoicePdf(booking);

            // Return PDF as File
            var fileName = $"Invoice_{booking.BookingCode}.pdf";
            return File(pdf, "application/pdf", fileName);
        }

        [Obsolete]
        private byte[] GenerateInvoicePdf(Booking booking)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Row(row =>
                    {
                        row.RelativeColumn().Text($"INVOICE #{booking.BookingCode}")
                            .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                        row.ConstantColumn(150)
                           .AlignRight()
                           .Text($"Date: {booking.CreatedAt:yyyy-MM-dd}")
                           .FontSize(12);
                    });

                    page.Content().PaddingVertical(15).Column(col =>
                    {
                        col.Spacing(8);

                        col.Item().Text($"Customer Name: {booking.UserName ?? "N/A"}");
                        col.Item().Text($"Venue: {booking.VenueName ?? "N/A"}");
                        col.Item().Text($"Status: {booking.Status}");
                        col.Item().Text($"Payment: {booking.PaymentStatus ?? "N/A"}");
                        col.Item().Text($"Total Price: ₹{booking.TotalPrice:F2}");
                        col.Item().Text($"Paid Amount: ₹{booking.PaidAmount:F2}");
                        col.Item().Text($"Due Amount: ₹{booking.DueAmount:F2}");

                    });

                    page.Footer().AlignCenter().Text("Thank you for booking with EventBooking!").FontSize(10);
                });
            });

            return document.GeneratePdf();
        }

    }
}
