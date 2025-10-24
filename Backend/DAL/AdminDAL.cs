using Dapper;
using System.Data;
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.DAL
{
    public class AdminDAL
    {
        private readonly IDbConnection _db;

        public AdminDAL(IDbConnection db)
        {
            _db = db;
        }

        // ----------------- Get all venue owners -----------------
        public async Task<IEnumerable<VenueOwnerDto>> GetAllOwnersAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT userid AS UserId, name AS Name, email AS Email, createdAt as RegisteredAt  FROM users WHERE role = 'VenueOwner'";
            return await _db.QueryAsync<VenueOwnerDto>(sql);
        }

        // ----------------- Get all venues -----------------
        public async Task<IEnumerable<VenueDto>> GetAllVenuesAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT v.venueid AS VenueId, v.name AS Name, v.location AS Location,
                       v.capacity AS Capacity, v.description AS Description,
                       v.ownerid AS OwnerId, u.name AS OwnerName
                FROM venues v
                JOIN users u ON v.ownerid = u.userid;
            ";
            return await _db.QueryAsync<VenueDto>(sql);
        }

        // ----------------- Get all bookings -----------------
        public async Task<(IEnumerable<BookingDto> Bookings, int TotalCount)> GetAllBookingsAsync(int pageNumber, int pageSize)
{
    if (_db.State != ConnectionState.Open)
        _db.Open();

    // Calculate offset
    int offset = (pageNumber - 1) * pageSize;

    // SQL query for paginated data
    var sql = @"
        SELECT b.bookingid AS BookingId, v.name AS VenueName, c.name AS CustomerName,
               b.bookingdate AS BookingDate, b.duration_hours AS DurationHours, b.timeduration AS Type,
               b.duration_days AS DurationDays, b.totalprice AS TotalPrice, b.status AS Status
        FROM bookings b
        JOIN venues v ON b.venueid = v.venueid
        JOIN users c ON b.customerid = c.userid
        ORDER BY b.bookingdate DESC
        LIMIT @PageSize OFFSET @Offset;

        SELECT COUNT(*) FROM bookings;
    ";

    using (var multi = await _db.QueryMultipleAsync(sql, new { PageSize = pageSize, Offset = offset }))
    {
        var bookings = await multi.ReadAsync<BookingDto>();
        var totalCount = await multi.ReadSingleAsync<int>();

        return (bookings, totalCount);
    }
}


        // ----------------- Get bookings by status -----------------
       public async Task<(IEnumerable<BookingDto> Bookings, int TotalCount)> GetBookingsByStatusAsync(
    string status, int pageNumber = 1, int pageSize = 10)
{
    if (_db.State != ConnectionState.Open)
        _db.Open();

    var offset = (pageNumber - 1) * pageSize;

    var sql = @"
        SELECT b.bookingid AS BookingId, v.name AS VenueName, c.name AS CustomerName,
               b.bookingdate AS BookingDate, b.duration_hours AS DurationHours, b.timeduration AS Type,
               b.duration_days AS DurationDays, b.totalprice AS TotalPrice, b.status AS Status
        FROM bookings b
        JOIN venues v ON b.venueid = v.venueid
        JOIN users c ON b.customerid = c.userid
        WHERE b.status = @Status
        ORDER BY b.bookingdate DESC
        LIMIT @PageSize OFFSET @Offset;

        SELECT COUNT(*) FROM bookings WHERE status = @Status;
    ";

    using var multi = await _db.QueryMultipleAsync(sql, new
    {
        Status = status,
        PageSize = pageSize,
        Offset = offset
    });

    var bookings = await multi.ReadAsync<BookingDto>();
    var totalCount = await multi.ReadFirstAsync<int>();

    return (bookings, totalCount);
}


        // ----------------- Get approved bookings by venue owner -----------------
        public async Task<IEnumerable<BookingDto>> GetApprovedBookingsByOwnerAsync(int ownerId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT b.bookingid AS BookingId, v.name AS VenueName, c.name AS CustomerName,
                       b.bookingdate AS BookingDate, b.duration_hours AS DurationHours,
                       b.duration_days AS DurationDays, b.totalprice AS TotalPrice, b.status AS Status
                FROM bookings b
                JOIN venues v ON b.venueid = v.venueid
                JOIN users c ON b.customerid = c.userid
                WHERE v.ownerid = @OwnerId AND b.status = 'Approved'
                ORDER BY b.bookingdate ASC;
            ";
            return await _db.QueryAsync<BookingDto>(sql, new { OwnerId = ownerId });
        }

        // ----------------- Get pending bookings by venue owner -----------------
        public async Task<IEnumerable<BookingDto>> GetPendingBookingsByOwnerAsync(int ownerId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT b.bookingid AS BookingId, v.name AS VenueName, c.name AS CustomerName,
                       b.bookingdate AS BookingDate, b.duration_hours AS DurationHours,
                       b.duration_days AS DurationDays, b.totalprice AS TotalPrice, b.status AS Status
                FROM bookings b
                JOIN venues v ON b.venueid = v.venueid
                JOIN users c ON b.customerid = c.userid
                WHERE v.ownerid = @OwnerId AND b.status = 'Pending'
                ORDER BY b.bookingdate ASC;
            ";
            return await _db.QueryAsync<BookingDto>(sql, new { OwnerId = ownerId });
        }

        // ----------------- Get total booking cost -----------------
        public async Task<decimal> GetTotalBookingCostAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT COALESCE(SUM(totalprice), 0) FROM bookings WHERE status = 'Approved';";
            return await _db.ExecuteScalarAsync<decimal>(sql);
        }

        // ----------------- Get total bookings count -----------------
        public async Task<int> GetTotalBookingsCountAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT COUNT(*) FROM bookings;";
            return await _db.ExecuteScalarAsync<int>(sql);
        }
        // ---------------- Get cancel Bookings --------------
        public async Task<int> GetTotalCancel()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT COUNT(*) FROM cancelled_bookings;";
            return await _db.ExecuteScalarAsync<int>(sql);
        }
        // ----------------- Get booking by ID -----------------
        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT b.bookingid AS BookingId, v.name AS VenueName, c.name AS CustomerName,
                       b.bookingdate AS BookingDate, b.duration_hours AS DurationHours,
                       b.duration_days AS DurationDays, b.totalprice AS TotalPrice, b.status AS Status
                FROM bookings b
                JOIN venues v ON b.venueid = v.venueid
                JOIN users c ON b.customerid = c.userid
                WHERE b.bookingid = @BookingId;
            ";
            return await _db.QueryFirstOrDefaultAsync<BookingDto>(sql, new { BookingId = bookingId });
        }
        // Get all Cancel list 
        public async Task<IEnumerable<CancelledBookingDto>> GetAllCancelAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
        SELECT 
    cb.bookingid AS BookingId,
    cb.venueid AS VenueId,
    cb.customerid AS CustomerId,
    u.name AS CustomerName,
    u.email AS UEmail,
    cb.bookingdate AS BookingDate,
    cb.timeduration AS TimeDuration,
    cb.duration_hours AS DurationHours,
    cb.duration_days AS DurationDays,
    cb.totalprice AS TotalPrice,
    cb.status AS Status,
    cb.createdat AS CreatedAt,
    cb.ispaid AS IsPaid,
    cb.cancel_reason AS CancelReason
FROM cancelled_bookings cb
JOIN users u ON cb.customerid = u.userid
ORDER BY cb.createdat DESC;
    ";

            var cancelledBookings = await _db.QueryAsync<CancelledBookingDto>(sql);
            return cancelledBookings;
        }

    }
}
