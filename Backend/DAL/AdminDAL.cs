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

            var sql = "SELECT userid AS UserId, name AS Name, email AS Email FROM users WHERE role = 'VenueOwner'";
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
        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
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
                ORDER BY b.bookingdate DESC;
            ";
            return await _db.QueryAsync<BookingDto>(sql);
        }

        // ----------------- Get bookings by status -----------------
        public async Task<IEnumerable<BookingDto>> GetBookingsByStatusAsync(string status)
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
                WHERE b.status = @Status
                ORDER BY b.bookingdate DESC;
            ";
            return await _db.QueryAsync<BookingDto>(sql, new { Status = status });
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

            var sql = "SELECT COALESCE(SUM(totalprice), 0) FROM bookings;";
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
    }
}
