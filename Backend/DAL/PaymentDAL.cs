using Dapper;
using System.Data;
using backend.DTOs;

namespace backend.DAL
{
    public class PaymentDAL
    {
        private readonly IDbConnection _db;

        public PaymentDAL(IDbConnection db)
        {
            _db = db;
        }

        public async Task<PaymentDto> CreatePaymentAsync(int bookingId, string paymentMethod)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            // Get booking details
            var booking = await _db.QueryFirstOrDefaultAsync<BookingDto>(
                "SELECT bookingid, customerid, venueid, totalprice, ispaid FROM bookings WHERE bookingid = @BookingId",
                new { BookingId = bookingId });

            if (booking == null)
                throw new Exception("Booking not found");

            // Insert payment
            var sql = @"
                INSERT INTO payments (bookingid, venueid, amount, paymentmethod, status, createdat)
                VALUES (@BookingId, @VenueId, @Amount, @PaymentMethod, @Status, @CreatedAt)
                RETURNING paymentid;
            ";

            var paymentId = await _db.ExecuteScalarAsync<int>(sql, new
            {
                BookingId = booking.BookingId,
                VenueId = booking.VenueId,
                Amount = booking.TotalPrice,
                PaymentMethod = paymentMethod,
                Status = "Success",
                CreatedAt = DateTime.UtcNow
            });

            // Update booking's ispaid to true
            var updateSql = "UPDATE bookings SET ispaid = TRUE WHERE bookingid = @BookingId";
            await _db.ExecuteAsync(updateSql, new { BookingId = booking.BookingId });

            return new PaymentDto
            {
                PaymentId = paymentId,
                BookingId = booking.BookingId,
                VenueId = booking.VenueId,
                Amount = booking.TotalPrice,
                PaymentMethod = paymentMethod,
                Status = "Success",
                CreatedAt = DateTime.UtcNow
            };
        }

        public async Task<PaymentDto?> GetPaymentByIdAsync(int paymentId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT * FROM payments WHERE paymentid = @PaymentId";
            return await _db.QueryFirstOrDefaultAsync<PaymentDto>(sql, new { PaymentId = paymentId });
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT bookingid, customerid, venueid, totalprice, ispaid FROM bookings WHERE bookingid = @BookingId";
            return await _db.QueryFirstOrDefaultAsync<BookingDto>(sql, new { BookingId = bookingId });
        }

        public async Task<PaymentDto?> GetPaymentByBookingIdAsync(int bookingId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            // Get the most recent payment for the booking
            var sql = @"
                SELECT *
                FROM payments
                WHERE bookingid = @BookingId
                ORDER BY createdat DESC
                LIMIT 1
            ";

            return await _db.QueryFirstOrDefaultAsync<PaymentDto>(sql, new { BookingId = bookingId });
        }

    }
}
