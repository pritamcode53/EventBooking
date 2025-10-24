using backend.Models;
using backend.Common.Enums;
using Dapper;
using System.Data;

namespace backend.DAL
{
    public class BookingDAL
    {
        private readonly IDbConnection _db;

        public BookingDAL(IDbConnection db)
        {
            _db = db;
        }

        // ----------------- Create Booking -----------------
        public async Task<int> AddBookingAsync(Booking booking)
        {
            var parameters = new
            {
                booking.VenueId,
                booking.CustomerId,
                booking.BookingDate,
                TimeDuration = (int)booking.TimeDuration, // cast enum to INT
                booking.TotalPrice,
                Status = booking.Status.ToString(), // string is okay for status
                booking.CreatedAt,
                booking.DurationHours,
                booking.DurationDays
            };

            var sql = @"
                INSERT INTO bookings 
                    (venueid, customerid, bookingdate, timeduration, totalprice, status, createdat, duration_hours, duration_days)
                VALUES 
                    (@VenueId, @CustomerId, @BookingDate, @TimeDuration, @TotalPrice, @Status, @CreatedAt, @DurationHours, @DurationDays)
                RETURNING bookingid;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteScalarAsync<int>(sql, parameters);
        }

        // ----------------- Update Booking Status -----------------
        public async Task<int> UpdateBookingStatusAsync(int bookingId, BookingStatus status, int customerId)
        {
            var sql = @"
                UPDATE bookings
                SET status = @Status
                WHERE bookingid = @BookingId AND customerid = @CustomerId
            ";

            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new
            {
                BookingId = bookingId,
                CustomerId = customerId,
                Status = status.ToString()
            });
        }

        // ----------------- Cancel/Delete Booking -----------------
       public async Task<int> CancelBookingAsync(int bookingId, int customerId, string cancelReason)
        {
            var sql = @"
                INSERT INTO cancelled_bookings (
                    bookingid, venueid, customerid, bookingdate, timeduration, 
                    duration_hours, duration_days, totalprice, status, createdat, ispaid, cancel_reason
                )
                SELECT 
                    bookingid, venueid, customerid, bookingdate, timeduration, 
                    duration_hours, duration_days, totalprice, status, createdat, ispaid, @CancelReason
                FROM bookings
                WHERE bookingid = @BookingId AND customerid = @CustomerId;

                DELETE FROM bookings WHERE bookingid = @BookingId AND customerid = @CustomerId;
            ";

            if (_db.State != ConnectionState.Open)
                _db.Open();

            using (var transaction = _db.BeginTransaction())
            {
                try
                {
                    int rowsAffected = await _db.ExecuteAsync(sql, new
                    {
                        BookingId = bookingId,
                        CustomerId = customerId,
                        CancelReason = cancelReason
                    }, transaction);

                    transaction.Commit();
                    return rowsAffected;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }


        // ----------------- Get all bookings by a customer -----------------
        public async Task<IEnumerable<Booking>> GetBookingsByCustomerAsync(int customerId)
        {
            var sql = @"
        SELECT b.*,
               u.userid, u.name, u.email, u.role, u.createdat, u.updatedat,
               v.venueid, v.name, v.location, v.capacity, v.description, v.ownerid, v.createdat, v.updatedat
        FROM bookings b
        JOIN users u ON b.customerid = u.userid
        JOIN venues v ON b.venueid = v.venueid
        WHERE b.customerid = @CustomerId
        ORDER BY b.bookingdate DESC
    ";

            if (_db.State != ConnectionState.Open)
                _db.Open();

            var bookings = await _db.QueryAsync<Booking, User, Venue, Booking>(
                sql,
                (b, user, venue) =>
                {
                    b.Customer = user;
                    b.Venue = venue;
                    return b;
                },
                new { CustomerId = customerId },
                splitOn: "userid,venueid"
            );

            return bookings;
        }
        public async Task<IEnumerable<Booking>> GetApprovedBookingsByOwnerAsync(int ownerId)
{
    var sql = @"
        SELECT 
    b.bookingid,
    b.venueid AS BookingVenueId,
    b.customerid,
    b.bookingdate,
    b.timeduration AS TimeDuration,      -- enum mapping
    b.duration_hours AS DurationHours,
    b.duration_days AS DurationDays,
    b.totalprice,
    b.status,
    b.createdat,
    b.ispaid,

    u.userid,
    u.name,
    u.email,
    u.role,
    u.createdat AS user_createdat,
    u.updatedat AS user_updatedat,

    v.venueid AS Venue_VenueId,
    v.name,
    v.location,
    v.capacity,
    v.description,
    v.ownerid,
    v.createdat AS venue_createdat,
    v.updatedat AS venue_updatedat
FROM bookings b
JOIN venues v ON b.venueid = v.venueid
JOIN users u ON b.customerid = u.userid
WHERE v.ownerid = @OwnerId
  AND b.status = @Status
ORDER BY b.bookingdate ASC;
    ";

    if (_db.State != ConnectionState.Open)
        _db.Open();

    var bookings = await _db.QueryAsync<Booking, User, Venue, Booking>(
        sql,
        (b, user, venue) =>
        {
            b.Customer = user;
            b.Venue = venue;
            return b;
        },
        new 
        { 
            OwnerId = ownerId,                 // pass as int, not string
            Status = BookingStatus.Approved.ToString() // int for enum
        },
        splitOn: "userid,Venue_VenueId"       // matches your SELECT aliases
    );

    return bookings;
}


        // ----------------- Check if venue is available for requested date and hours -----------------
        public async Task<bool> IsVenueAvailableAsync(int venueId, DateTime date, int hours)
        {
            var sql = @"
                SELECT COUNT(1)
                FROM bookings
                WHERE venueid=@VenueId
                  AND status IN ('Pending','Approved')
                  AND @Date < bookingdate + (@Hours || ' hours')::interval
                  AND bookingdate < @Date + (@Hours || ' hours')::interval
            ";

            if (_db.State != ConnectionState.Open) _db.Open();
            var count = await _db.ExecuteScalarAsync<int>(sql, new { VenueId = venueId, Date = date, Hours = hours });
            return count == 0; // True if available
        }

        // ----------------- Approve/Reject Booking (Venue Owner) -----------------
        public async Task<int> UpdateBookingStatusByOwnerAsync(int bookingId, int ownerId, BookingStatus status)
        {
            var sql = @"
                UPDATE bookings b
                SET status = @Status
                FROM venues v
                WHERE b.bookingid = @BookingId
                  AND b.venueid = v.venueid
                  AND v.ownerid = @OwnerId
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.ExecuteAsync(sql, new
            {
                BookingId = bookingId,
                OwnerId = ownerId,
                Status = status.ToString()
            });
        }

        // ----------------- Get pending bookings for a venue owner -----------------
        public async Task<IEnumerable<Booking>> GetPendingBookingsByOwnerAsync(int ownerId)
        {
            var sql = @"
                SELECT b.*,
                       u.userid, u.name, u.email, u.role, u.createdat, u.updatedat,
                       v.venueid, v.name, v.location, v.capacity, v.description, v.ownerid, v.createdat, v.updatedat
                FROM bookings b
                JOIN venues v ON b.venueid = v.venueid
                JOIN users u ON b.customerid = u.userid
                WHERE v.ownerid = @OwnerId
                  AND b.status = 'Pending'
                ORDER BY b.bookingdate ASC
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            var bookings = await _db.QueryAsync<Booking, User, Venue, Booking>(
                sql,
                (b, user, venue) =>
                {
                    b.Customer = user;
                    b.Venue = venue;
                    return b;
                },
                new { OwnerId = ownerId },
                splitOn: "userid,venueid"
            );

            return bookings;
        }



        // ----------------- Get Booking By Id (with enriched info for emails) -----------------
        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            var sql = @"
                SELECT b.*, 
                       u.email AS CustomerEmail, 
                       u.name AS CustomerName, 
                       v.name AS VenueName
                FROM bookings b
                JOIN users u ON b.customerid = u.userid
                JOIN venues v ON b.venueid = v.venueid
                WHERE b.bookingid = @BookingId
            ";

            if (_db.State != ConnectionState.Open)
                _db.Open();

            return await _db.QueryFirstOrDefaultAsync<Booking>(sql, new { BookingId = bookingId });
        }
    }
}
