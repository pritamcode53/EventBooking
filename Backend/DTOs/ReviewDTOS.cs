using Microsoft.AspNetCore.Http;

namespace backend.DTOs
{
    public class ReviewCreateDto
    {
        public int VenueId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public IFormFile? Image { get; set; }
    }
    public class ReviewResponseDto
    {
        public int ReviewId { get; set; }
        public int VenueId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
