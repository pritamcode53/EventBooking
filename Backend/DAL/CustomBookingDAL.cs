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
        public async Task<int> CreateCustomBookingAsync(int userId, int type, string requirements)
        {
            var sql = @"
                INSERT INTO custom_booking_requests (user_id, type, requirements)
                VALUES (@UserId, @Type, @Requirements)
                RETURNING request_id;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.ExecuteScalarAsync<int>(sql, new
            {
                UserId = userId,
                Type = type,
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
                    type AS Type,
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
                    type AS Type,
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
                    type AS Type,
                    requirements AS Requirements,
                    created_at AS CreatedAt
                FROM custom_booking_requests
                ORDER BY created_at DESC;
            ";

            if (_db.State != ConnectionState.Open) _db.Open();

            return await _db.QueryAsync<CustomBookingRequest>(sql);
        }
    }
}
