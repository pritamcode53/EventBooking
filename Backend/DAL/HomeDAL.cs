using Dapper;
using System.Data;
using backend.DTOs;

namespace backend.DAL
{
    public class HomeDAL
    {
        private readonly IDbConnection _db;

        public HomeDAL(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<VenueDetailsDto>> GetAllVenuesAsync(VenueFilterDto? filters = null)
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            // Main query with optional filters
            var sql = @"
                SELECT DISTINCT v.venueid, v.name, v.location, v.capacity, v.description
                FROM venues v
                LEFT JOIN venue_pricings p ON p.venueid = v.venueid
                WHERE (@Location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', @Location, '%')))
                  AND (@MinCapacity IS NULL OR v.capacity >= @MinCapacity)
                  AND (@MaxCapacity IS NULL OR v.capacity <= @MaxCapacity)
                  AND (@MinPrice IS NULL OR p.price >= @MinPrice)
                  AND (@MaxPrice IS NULL OR p.price <= @MaxPrice);
            ";

            var venues = (await _db.QueryAsync<VenueDetailsDto>(sql, filters)).AsList();

            foreach (var venue in venues)
            {
                // Fetch pricing
                var pricings = await _db.QueryAsync<VenuePricingDto>(
                    "SELECT type AS Type, price AS Price FROM venue_pricings WHERE venueid = @VenueId",
                    new { venue.VenueId });
                venue.Pricings = pricings.AsList();

                // Fetch images
                var images = await _db.QueryAsync<string>(
                    "SELECT imageurl FROM venue_images WHERE venueid = @VenueId",
                    new { venue.VenueId });
                venue.Images = images.AsList();

                // Fetch reviews
                var reviews = await _db.QueryAsync<ReviewDto>(@"
                    SELECT r.reviewid, r.rating, r.comment, u.name AS ReviewerName
                    FROM venue_reviews r
                    JOIN users u ON r.userid = u.userid
                    WHERE r.venueid = @VenueId
                    ORDER BY r.createdat DESC
                ", new { venue.VenueId });
                venue.Reviews = reviews.AsList();
            }

            return venues;
        }

        public async Task<IEnumerable<string>> GetAllLocationsAsync()
        {
            if (_db.State != ConnectionState.Open)
                _db.Open();

            var sql = "SELECT DISTINCT location FROM venues ORDER BY location ASC;";
            var locations = await _db.QueryAsync<string>(sql);
            return locations;
        }
    }
}
