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
        public async Task<int> DeleteBookingAsync(int bookingId, int customerId)
        {
            var sql = "DELETE FROM bookings WHERE bookingid=@BookingId AND customerid=@CustomerId";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new { BookingId = bookingId, CustomerId = customerId });
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
        SELECT b.*,
               u.userid, u.name, u.email, u.role, u.createdat, u.updatedat,
               v.venueid, v.name, v.location, v.capacity, v.description, v.ownerid, v.createdat, v.updatedat
        FROM bookings b
        JOIN venues v ON b.venueid = v.venueid
        JOIN users u ON b.customerid = u.userid
        WHERE v.ownerid = @OwnerId
          AND b.status = 'Approved'
        ORDER BY b.bookingdate ASC
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
                new { OwnerId = ownerId },
                splitOn: "userid,venueid"
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
