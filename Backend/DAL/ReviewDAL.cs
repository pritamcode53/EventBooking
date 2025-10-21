using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using backend.Models;

namespace backend.DAL
{
    public class ReviewDAL
    {
        private readonly IDbConnection _db;

        public ReviewDAL(IDbConnection db)
        {
            _db = db;
        }

        // Add a new review
        public async Task<int> AddReviewAsync(Review review)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                INSERT INTO venue_reviews (venueid, userid, rating, comment, imagepath, createdat)
                VALUES (@VenueId, @UserId, @Rating, @Comment, @ImagePath, @CreatedAt)
                RETURNING reviewid;
            ";

            var parameters = new
            {
                review.VenueId,
                review.UserId,
                review.Rating,
                review.Comment,
                review.ImagePath,
                review.CreatedAt
            };

            return await _db.ExecuteScalarAsync<int>(sql, parameters);
        }

        // Get all reviews for a specific venue
        public async Task<IEnumerable<Review>> GetReviewsByVenueAsync(int venueId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT reviewid, venueid, userid, rating, comment, imagepath, createdat
                FROM venue_reviews
                WHERE venueid = @VenueId
                ORDER BY createdat DESC
            ";

            return await _db.QueryAsync<Review>(sql, new { VenueId = venueId });
        }

        // Check if a user has booked this venue and booking is approved
        public async Task<bool> HasUserBookedVenueAsync(int userId, int venueId)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT COUNT(1)
                FROM bookings
                WHERE customerid = @UserId
                  AND venueid = @VenueId
                  AND status = 'Approved'
            ";

            var count = await _db.ExecuteScalarAsync<int>(sql, new { UserId = userId, VenueId = venueId });
            return count > 0;
        }
    }
}
