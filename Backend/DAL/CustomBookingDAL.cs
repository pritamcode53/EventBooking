using System.Data;
using System.Threading.Tasks;
using Dapper;
using backend.Models;
using System.Collections.Generic;

namespace backend.DAL
{
    public class CustomBookingDAL
    {
        private readonly IDbConnection _db;

        public CustomBookingDAL(IDbConnection db)
        {
            _db = db;
        }

        /// <summary>
        /// Create a new custom booking request
        /// </summary>
        public async Task<int> CreateCustomBookingAsync(int userId, int bookingId, string requirements)
        {
            const string sql = @"
        INSERT INTO custom_booking_requests (user_id, booking_id, requirements, created_at)
        VALUES (@UserId, @BookingId, @Requirements, NOW())
        RETURNING request_id;
    ";



            return await _db.ExecuteScalarAsync<int>(sql, new
            {
                UserId = userId,
                BookingId = bookingId,
                Requirements = requirements
            });

        }



        /// <summary>
        /// Get all custom booking requests created by a specific user
        /// </summary>
        public async Task<IEnumerable<CustomBookingRequest>> GetCustomBookingsByUserAsync(int userId)
        {
            var sql = @"
                SELECT 
                    request_id AS RequestId,
                    user_id AS UserId,
                    requirements AS Requirements,
                    created_at AS CreatedAt
                FROM custom_booking_requests
                WHERE user_id = @UserId
                ORDER BY created_at DESC;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.QueryAsync<CustomBookingRequest>(sql, new { UserId = userId });
        }

        /// <summary>
        /// Get a single custom booking request by ID
        /// </summary>
        public async Task<CustomBookingRequest?> GetCustomBookingByIdAsync(int requestId)
        {
            var sql = @"
                SELECT 
                    request_id AS RequestId,
                    user_id AS UserId,
                    requirements AS Requirements,
                    created_at AS CreatedAt
                FROM custom_booking_requests
                WHERE request_id = @RequestId;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.QueryFirstOrDefaultAsync<CustomBookingRequest>(sql, new { RequestId = requestId });
        }

        /// <summary>
        /// Delete a custom booking request by user
        /// </summary>
        public async Task<int> DeleteCustomBookingAsync(int requestId, int userId)
        {
            var sql = @"
                DELETE FROM custom_booking_requests
                WHERE request_id = @RequestId
                  AND user_id = @UserId;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.ExecuteAsync(sql, new { RequestId = requestId, UserId = userId });
        }

        /// <summary>
        /// Get all custom booking requests (for admin)
        /// </summary>
        public async Task<IEnumerable<CustomBookingRequest>> GetAllCustomBookingsAsync()
        {
            var sql = @"
                SELECT 
                    request_id AS RequestId,
                    user_id AS UserId,
                    requirements AS Requirements,
                    created_at AS CreatedAt
                FROM custom_booking_requests
                ORDER BY created_at DESC;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.QueryAsync<CustomBookingRequest>(sql);
        }

        public async Task<bool> UpdateBookingPriceAsync(int bookingId, decimal newPrice, string ownerReview)
        {
            var query = @"
                UPDATE bookings 
                SET customnewprice = @NewPrice, ownerreview = @OwnerReview
                WHERE bookingid = @BookingId;
            ";

            var rows = await _db.ExecuteAsync(query, new
            {
                BookingId = bookingId,
                NewPrice = newPrice,
                OwnerReview = ownerReview
            });

            return rows > 0;
        }

        public async Task<bool> UpdateUserApprovalAsync(int requestId, bool isApproved)
        {
            // Step 1: Get booking_id from the custom_booking_requests table
            var bookingIdQuery = "SELECT booking_id FROM custom_booking_requests WHERE request_id = @RequestId";
            var bookingId = await _db.ExecuteScalarAsync<int?>(bookingIdQuery, new { RequestId = requestId });

            if (bookingId == null)
                return false; // No matching booking

            // Step 2: Update user approval status
            var status = isApproved ? true : false;
            var sql = "UPDATE bookings SET isuserapproved = @Status WHERE bookingid = @BookingId";
            var rows = await _db.ExecuteAsync(sql, new { BookingId = bookingId, Status = status });

            // Step 3: If user approved, adjust the total price
            if (isApproved)
            {
                var updateBookingSql = @"
            UPDATE bookings 
            SET totalprice = totalprice + COALESCE(customnewprice, 0)
            WHERE bookingid = @BookingId;
        ";
                await _db.ExecuteAsync(updateBookingSql, new { BookingId = bookingId });
            }

            return rows > 0;
        }



    }
}
