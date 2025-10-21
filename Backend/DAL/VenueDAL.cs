using Dapper;
using System.Data;
using backend.Models;
using backend.Common.Enums;

namespace backend.DAL
{
    public class VenueDAL
    {
        private readonly IDbConnection _db;

        public VenueDAL(IDbConnection db)
        {
            _db = db;
        }

        // ----------------- Add Venue -----------------
        public async Task<int> AddVenueAsync(Venue venue)
        {
            const string sql = @"
                INSERT INTO venues (name, location, capacity, description, ownerid, createdat, updatedat)
                VALUES (@Name, @Location, @Capacity, @Description, @OwnerId, @CreatedAt, @UpdatedAt)
                RETURNING venueid;
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteScalarAsync<int>(sql, venue);
        }

        // ----------------- Get Venue by Id -----------------
        public async Task<Venue?> GetVenueByIdAsync(int id)
        {
            const string sql = "SELECT * FROM venues WHERE venueid=@Id";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QuerySingleOrDefaultAsync<Venue>(sql, new { Id = id });
        }

        // ----------------- Update Venue -----------------
        public async Task<int> UpdateVenueAsync(Venue venue)
        {
            const string sql = @"
                UPDATE venues
                SET name=@Name, location=@Location, capacity=@Capacity, description=@Description, updatedat=@UpdatedAt
                WHERE venueid=@VenueId AND ownerid=@OwnerId
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, venue);
        }

        // ----------------- Delete Venue -----------------
        public async Task<int> DeleteVenueAsync(int venueId, int ownerId)
        {
            const string sql = "DELETE FROM venues WHERE venueid=@VenueId AND ownerid=@OwnerId";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new { VenueId = venueId, OwnerId = ownerId });
        }

        // ----------------- Add Venue Image -----------------
        public async Task<int> AddVenueImageAsync(VenueImage image)
        {
            const string sql = @"
                INSERT INTO venue_images (venueid, imageurl, createdat)
                VALUES (@VenueId, @ImageUrl, @CreatedAt)
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, image);
        }

        // ----------------- Add Venue Pricing -----------------
        public async Task<int> AddVenuePricingAsync(VenuePricing pricing)
        {
            const string sql = @"
                INSERT INTO venue_pricings (venueid, type, price, createdat)
                VALUES (@VenueId, @Type, @Price, @CreatedAt)
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new
            {
                pricing.VenueId,
                Type = (int)pricing.Type, // store as integer
                pricing.Price,
                pricing.CreatedAt
            });
        }

        // ----------------- Get all images of a venue -----------------
        public async Task<IEnumerable<VenueImage>> GetVenueImagesAsync(int venueId)
        {
            const string sql = "SELECT * FROM venue_images WHERE venueid=@VenueId";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QueryAsync<VenueImage>(sql, new { VenueId = venueId });
        }

        // ----------------- Get Venue Pricing by Type -----------------
        public async Task<VenuePricing?> GetVenuePricingAsync(int venueId, PricingType type)
        {
            const string sql = "SELECT * FROM venue_pricings WHERE venueid = @VenueId AND type = @Type LIMIT 1";

            if (_db.State != ConnectionState.Open) 
                _db.Open();

            return await _db.QueryFirstOrDefaultAsync<VenuePricing>(sql, new
            {
                VenueId = venueId,        // matches INT column
                Type = ((int)type).ToString()     // convert enum to string to match VARCHAR
            });
        }


        // ----------------- Get Pricing by ID -----------------
        public async Task<VenuePricing?> GetVenuePricingByIdAsync(int venuePricingId)
        {
            const string sql = "SELECT * FROM venue_pricings WHERE venuepricingid = @Id";
            if (_db.State != ConnectionState.Open) _db.Open();
            return (await _db.QueryAsync<VenuePricing>(sql, new { Id = venuePricingId })).FirstOrDefault();
        }

        // ----------------- Update Pricing -----------------
        public async Task<int> UpdateVenuePricingAsync(VenuePricing pricing)
        {
            const string sql = @"
                UPDATE venue_pricings
                SET type = @Type, price = @Price, updatedat = @UpdatedAt
                WHERE venuepricingid = @VenuePricingId
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new
            {
                Type = (int)pricing.Type,
                pricing.Price,
                pricing.UpdatedAt,
                pricing.VenuePricingId
            });
        }

        // ----------------- Update Future Bookings Pricing -----------------
        public async Task<int> UpdateFutureBookingsPricingAsync(int venueId, PricingType type, decimal newPrice)
        {
            const string sql = @"
                UPDATE bookings
                SET totalprice = @NewPrice * timeduration::int
                WHERE venueid = @VenueId
                  AND timeduration::int = @Type
                  AND bookingdate > NOW()
                  AND status = 'Pending';
            ";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.ExecuteAsync(sql, new
            {
                VenueId = venueId,
                Type = (int)type,
                NewPrice = newPrice
            });
        }
        public async Task<IEnumerable<Venue>> GetVenuesByOwnerAsync(int ownerId)
        {
            var sql = @"
                SELECT * 
                FROM venues 
                WHERE ownerid = @OwnerId
                ORDER BY createdat DESC
            ";

            if (_db.State != ConnectionState.Open)
                _db.Open();

            return await _db.QueryAsync<Venue>(sql, new { OwnerId = ownerId });
        }

        // ----------------- Get Venue Owner -----------------
        public async Task<User?> GetVenueOwnerAsync(int ownerId)
        {
            const string sql = "SELECT userid, name, email FROM users WHERE userid=@OwnerId";
            if (_db.State != ConnectionState.Open) _db.Open();
            return await _db.QueryFirstOrDefaultAsync<User>(sql, new { OwnerId = ownerId });
        }
    }
}
