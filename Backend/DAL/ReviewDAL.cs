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
        // get the average reviews for the home 
        public async Task<IEnumerable<dynamic>> GetAverageRatingByVenueAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = @"
                SELECT 
                    venueid AS VenueId,
                    COALESCE(AVG(rating), 0) AS AverageRating,
                    COUNT(reviewid) AS TotalReviews
                FROM venue_reviews
                GROUP BY venueid
                ORDER BY venueid;
            ";

            return await _db.QueryAsync(sql);
        }

        // get top rated venue 
       public async Task<IEnumerable<dynamic>> GetTopRatedVenuesAsync()
{
    if (_db.State != ConnectionState.Open)
        _db.Open();

    var sql = @"
        SELECT 
            v.venueid AS VenueId,
            v.name AS VenueName,
            COALESCE(AVG(r.rating), 0) AS AverageRating,
            COUNT(r.reviewid) AS TotalReviews,
            vi.imageurl AS VenueImage
        FROM venues v
        LEFT JOIN venue_reviews r ON v.venueid = r.venueid
        LEFT JOIN venue_images vi ON v.venueid = vi.venueid
        GROUP BY v.venueid, v.name, vi.imageurl
        ORDER BY AverageRating DESC, TotalReviews DESC;
    ";

    return await _db.QueryAsync(sql);
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
