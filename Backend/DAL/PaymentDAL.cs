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

        /// <summary>
        /// Creates a new payment entry (partial or full)
        /// and updates the booking's paid and due amounts accordingly.
        /// </summary>
        public async Task<PaymentDto> CreatePartialPaymentAsync(int bookingId, decimal amount, string paymentMethod)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            using var transaction = _db.BeginTransaction();

            try
            {
                // Get booking details
                var booking = await _db.QueryFirstOrDefaultAsync<BookingDto>(
                    "SELECT bookingid, venueid, totalprice, paidamount, paymentstatus FROM bookings WHERE bookingid = @BookingId",
                    new { BookingId = bookingId }, transaction);

                if (booking == null)
                    throw new Exception("Booking not found");

                // Validate payment amount
                var newPaidAmount = booking.PaidAmount + amount;
                if (newPaidAmount > booking.TotalPrice)
                    throw new Exception("Payment exceeds total price.");

                // Insert payment record
                var insertSql = @"
                    INSERT INTO payments (bookingid, venueid, amount, paymentmethod, status, createdat)
                    VALUES (@BookingId, @VenueId, @Amount, @PaymentMethod, @Status, @CreatedAt)
                    RETURNING paymentid;
                ";

                var paymentId = await _db.ExecuteScalarAsync<int>(insertSql, new
                {
                    BookingId = booking.BookingId,
                    VenueId = booking.VenueId,
                    Amount = amount,
                    PaymentMethod = paymentMethod,
                    Status = "Success",
                    CreatedAt = DateTime.UtcNow
                }, transaction);

                // Determine updated payment status
                string newPaymentStatus = newPaidAmount switch
                {
                    var n when n == 0 => "Unpaid",
                    var n when n < booking.TotalPrice => "Partial",
                    var n when n >= booking.TotalPrice => "Paid",
                    _ => booking.PaymentStatus
                };

                // Update booking record
                var updateSql = @"
                    UPDATE bookings
                    SET paidamount = @PaidAmount,
                        paymentstatus = @PaymentStatus
                    WHERE bookingid = @BookingId;
                ";

                await _db.ExecuteAsync(updateSql, new
                {
                    PaidAmount = newPaidAmount,
                    PaymentStatus = newPaymentStatus,
                    BookingId = booking.BookingId
                }, transaction);

                transaction.Commit();

                return new PaymentDto
                {
                    PaymentId = paymentId,
                    BookingId = booking.BookingId,
                    VenueId = booking.VenueId,
                    Amount = amount,
                    PaymentMethod = paymentMethod,
                    Status = "Success",
                    CreatedAt = DateTime.UtcNow
                };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<PaymentDto>> GetPaymentsByBookingIdAsync(int bookingId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT * FROM payments WHERE bookingid = @BookingId ORDER BY createdat DESC";
            return await _db.QueryAsync<PaymentDto>(sql, new { BookingId = bookingId });
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
{
    if (_db.State != ConnectionState.Open)
        _db.Open();

    var sql = @"
        SELECT 
            b.bookingid AS BookingId,
            b.customerid AS CustomerId,
            b.venueid AS VenueId,
            b.totalprice AS TotalPrice,
            b.status AS Status,
            v.venueid AS Venue_VenueId,
            v.ownerid AS OwnerId,
            v.name AS VenueName
        FROM bookings b
        JOIN venues v ON b.venueid = v.venueid
        WHERE b.bookingid = @BookingId;
    ";

    var result = await _db.QueryAsync<BookingDto, VenueDto, BookingDto>(
        sql,
        (b, v) =>
        {
            b.Venue = v;
            return b;
        },
        new { BookingId = bookingId },
        splitOn: "Venue_VenueId"
    );

    return result.FirstOrDefault();
}

    }
}
