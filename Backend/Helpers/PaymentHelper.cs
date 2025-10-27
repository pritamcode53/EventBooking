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

        /// <summary>
        /// Processes a payment (partial or full) for a booking.
        /// </summary>
        public async Task<PaymentDto> ProcessPaymentAsync(int bookingId, decimal amount, string paymentMethod)
        {
            // Call DAL method for partial payment
            return await _paymentDAL.CreatePartialPaymentAsync(bookingId, amount, paymentMethod);
        }

        /// <summary>
        /// Retrieves booking details by booking ID.
        /// </summary>
        public async Task<BookingDto?> GetBookingAsync(int bookingId)
        {
            return await _paymentDAL.GetBookingByIdAsync(bookingId);
        }

        /// <summary>
        /// Verifies that the booking belongs to the specified user.
        /// </summary>
      public async Task<bool> IsBookingBelongsToUser(int bookingId, int userId)
        {
            var booking = await GetBookingAsync(bookingId);
            Console.WriteLine($"BookingId: {booking?.BookingId}, CustomerId: {booking?.CustomerId}, VenueOwnerId: {booking?.Venue?.OwnerId}");
            return booking != null &&
                (booking.CustomerId == userId || booking.Venue?.OwnerId == userId);
        }



        /// <summary>
        /// Retrieves all payments made for a given booking.
        /// </summary>
        public async Task<IEnumerable<PaymentDto>> GetPaymentsByBookingAsync(int bookingId)
        {
            return await _paymentDAL.GetPaymentsByBookingIdAsync(bookingId);

        }
    }
}
