using backend.DAL;
using backend.DTOs;
using backend.Models;

namespace backend.Helpers
{
    public class ReviewHelper
    {
        private readonly ReviewDAL _reviewDAL;
        private readonly VenueDAL _venueDAL;
        private readonly IWebHostEnvironment _env;

        public ReviewHelper(ReviewDAL reviewDAL, VenueDAL venueDAL, IWebHostEnvironment env)
        {
            _reviewDAL = reviewDAL;
            _venueDAL = venueDAL;
            _env = env;
        }

        public async Task<int> AddReviewAsync(ReviewCreateDto dto, int userId)
        {
            // ✅ Ensure the user has actually booked this venue
            bool hasBooked = await _reviewDAL.HasUserBookedVenueAsync(userId, dto.VenueId);
            if (!hasBooked)
                throw new Exception("You can only review venues you have booked and that are approved.");

            // ✅ Fetch venue details for folder naming
            var venue = await _venueDAL.GetVenueByIdAsync(dto.VenueId);
            if (venue == null)
                throw new Exception("Venue not found.");

            string? imagePath = null;

            // ✅ Save image if provided
            if (dto.Image != null)
            {
                var venueFolder = venue.Name.Replace(" ", "_");
                var folderPath = Path.Combine(_env.WebRootPath, "images", "review", venueFolder);

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Image.FileName)}";
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                // Store relative path (for frontend use)
                imagePath = $"/images/review/{venueFolder}/{fileName}";
            }

            // ✅ Create Review Model
            var review = new Review
            {
                VenueId = dto.VenueId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                ImagePath = imagePath
            };

            // ✅ Insert Review
            return await _reviewDAL.AddReviewAsync(review);
        }

        public async Task<IEnumerable<Review>> GetVenueReviewsAsync(int venueId)
        {
            return await _reviewDAL.GetReviewsByVenueAsync(venueId);
        }
        public async Task<IEnumerable<dynamic>> GetAverageRatingByVenueAsync()
        {
            return await _reviewDAL.GetAverageRatingByVenueAsync();
        }

    }
}
