// PaymentHelper.cs
using backend.DAL;
using backend.DTOs;

namespace backend.Helpers
{
    public class PaymentHelper
    {
        private readonly PaymentDAL _paymentDAL;

        public PaymentHelper(PaymentDAL paymentDAL)
        {
            _paymentDAL = paymentDAL;
        }

        public async Task<PaymentDto> ProcessPaymentAsync(int bookingId, string paymentMethod )
        {
            // Return PaymentDto directly
            return await _paymentDAL.CreatePaymentAsync(bookingId, paymentMethod);
        }

        public async Task<BookingDto?> GetBookingAsync(int bookingId)
        {
            return await _paymentDAL.GetBookingByIdAsync(bookingId);
        }

        public async Task<bool> IsBookingBelongsToUser(int bookingId, int userId)
        {
            var booking = await GetBookingAsync(bookingId);
            if (booking == null) return false;
            return booking.CustomerId == userId;
        }
    }
}
