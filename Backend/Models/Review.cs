namespace backend.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int VenueId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; } // 1–5 stars
        public string? Comment { get; set; }
        public string? ImagePath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Venue? Venue { get; set; }
        public User? User { get; set; }
    }
}
