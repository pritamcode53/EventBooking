using backend.DAL;
using backend.Models;
using backend.DTOs;

namespace backend.Helpers
{
    public class VenueHelper
    {
        private readonly VenueDAL _dal;
        private readonly IWebHostEnvironment _env;

        public VenueHelper(VenueDAL dal, IWebHostEnvironment env)
        {
            _dal = dal;
            _env = env;
        }

        // Add venue
        public async Task<int> AddVenueAsync(Venue venue, int ownerId)
        {
            venue.OwnerId = ownerId;
            venue.CreatedAt = DateTime.UtcNow;
            venue.UpdatedAt = DateTime.UtcNow;
            return await _dal.AddVenueAsync(venue);
        }

        // Get venue by ID
        public async Task<Venue?> GetVenueByIdAsync(int id) =>
            await _dal.GetVenueByIdAsync(id);

        // Update venue with partial update
        public async Task<int> UpdateVenueAsync(int id, VenueUpdateDto dto, int ownerId)
        {
            var existingVenue = await _dal.GetVenueByIdAsync(id);
            if (existingVenue == null || existingVenue.OwnerId != ownerId) return 0;

            existingVenue.Name = dto.Name ?? existingVenue.Name;
            existingVenue.Location = dto.Location ?? existingVenue.Location;
            existingVenue.Capacity = dto.Capacity ?? existingVenue.Capacity;
            existingVenue.Description = dto.Description ?? existingVenue.Description;
            existingVenue.UpdatedAt = DateTime.UtcNow;

            return await _dal.UpdateVenueAsync(existingVenue);
        }

        // Delete venue
        public async Task<int> DeleteVenueAsync(int venueId, int ownerId)
        {
            var existingVenue = await _dal.GetVenueByIdAsync(venueId);
            if (existingVenue == null || existingVenue.OwnerId != ownerId) return 0;

            return await _dal.DeleteVenueAsync(venueId, ownerId);
        }

        // Add venue image
        public async Task<List<int>> AddVenueImagesAsync(List<IFormFile> files, int venueId)
        {
            if (files == null || files.Count == 0)
                throw new ArgumentException("At least one image file is required.");

            var savedIds = new List<int>();
            var folderPath = Path.Combine(_env.WebRootPath, "images", "venues");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            foreach (var file in files)
            {
                if (file == null || file.Length == 0) continue;

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/venues/{fileName}";
                var image = new VenueImage
                {
                    VenueId = venueId,
                    ImageUrl = imageUrl,
                    CreatedAt = DateTime.UtcNow
                };

                var id = await _dal.AddVenueImageAsync(image);
                savedIds.Add(id);
            }

            return savedIds;
        }

        // Add venue pricing
        public async Task<int> AddVenuePricingAsync(VenuePricing pricing, int ownerId)
        {
            pricing.CreatedAt = DateTime.UtcNow;
            var result = await _dal.AddVenuePricingAsync(pricing);

            // Optional: update pending/future bookings dynamically
            await _dal.UpdateFutureBookingsPricingAsync(pricing.VenueId, pricing.Type, pricing.Price);

            return result;
        }

        // Update venue pricing
        public async Task<int> UpdateVenuePricingAsync(int venuePricingId, VenuePricing updatedPricing, int ownerId)
        {
            var existingPricing = await _dal.GetVenuePricingByIdAsync(venuePricingId);
            if (existingPricing == null) return 0;

            var venue = await _dal.GetVenueByIdAsync(existingPricing.VenueId);
            if (venue == null || venue.OwnerId != ownerId) return 0;

            existingPricing.Type = updatedPricing.Type;
            existingPricing.Price = updatedPricing.Price;
            existingPricing.UpdatedAt = DateTime.UtcNow;

            var result = await _dal.UpdateVenuePricingAsync(existingPricing);

            // ✅ Update pending/future bookings dynamically
            await _dal.UpdateFutureBookingsPricingAsync(existingPricing.VenueId, existingPricing.Type, existingPricing.Price);

            return result;
        }

        public async Task<IEnumerable<Venue>> GetVenuesByOwnerAsync(int ownerId)
        {
            return await _dal.GetVenuesByOwnerAsync(ownerId);
        }
    }
}
