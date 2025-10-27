using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.DTOs;
using backend.Common;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentHelper _paymentHelper;

        public PaymentController(PaymentHelper paymentHelper)
        {
            _paymentHelper = paymentHelper;
        }

        /// <summary>
        /// Creates a payment (partial or full) for a specific booking.
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized(ApiResponse<string>.Fail("User not authenticated."));

                int userId = int.Parse(userIdClaim.Value);

                //  Validate booking ownership
                bool isOwner = await _paymentHelper.IsBookingBelongsToUser(request.BookingId, userId);
                if (!isOwner)
                    return BadRequest(ApiResponse<string>.Fail("You are not allowed to pay for this booking."));

                //  Validate amount
                if (request.Amount <= 0)
                    return BadRequest(ApiResponse<string>.Fail("Payment amount must be greater than zero."));
                // Process partial/full payment
                var payment = await _paymentHelper.ProcessPaymentAsync(request.BookingId, request.Amount, request.PaymentMethod);

                return Ok(ApiResponse<PaymentDto>.Ok(payment));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }

        /// <summary>
        /// Gets all payments related to a specific booking (payment history).
        /// </summary>
        [HttpGet("history/{bookingId}")]
        public async Task<IActionResult> GetPaymentHistory(int bookingId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized(ApiResponse<string>.Fail("User not authenticated."));

                int userId = int.Parse(userIdClaim.Value);

                // ✅ Validate booking ownership
                bool isOwner = await _paymentHelper.IsBookingBelongsToUser(bookingId, userId);
                if (!isOwner)
                    return BadRequest(ApiResponse<string>.Fail("You are not allowed to view this booking’s payments."));

                var payments = await _paymentHelper.GetPaymentsByBookingAsync(bookingId);

                return Ok(ApiResponse<IEnumerable<PaymentDto>>.Ok(payments));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }

    /// <summary>
    /// DTO for creating a payment (partial/full)
    /// </summary>
    public class PaymentRequest
    {
        public int BookingId { get; set; }
        public decimal Amount { get; set; }   // ✅ New field for partial payment amount
        public string PaymentMethod { get; set; } = "Card";
    }
}
