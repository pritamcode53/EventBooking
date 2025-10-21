// PaymentController.cs
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

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) 
                    return Unauthorized(ApiResponse<string>.Fail("User not authenticated"));

                int userId = int.Parse(userIdClaim.Value);

                // Booking ownership check
                bool isOwner = await _paymentHelper.IsBookingBelongsToUser(request.BookingId, userId);
                if (!isOwner)
                    return BadRequest(ApiResponse<string>.Fail("You are not allowed to pay for this booking"));

                // Process payment
                var payment = await _paymentHelper.ProcessPaymentAsync(request.BookingId, request.PaymentMethod);

                return Ok(ApiResponse<PaymentDto>.Ok(payment));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }

    public class PaymentRequest
    {
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; } = "Card";
    }
}
