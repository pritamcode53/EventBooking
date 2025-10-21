namespace backend.Models
{
    public class VenueImage
    {
        public int VenueImageId { get; set; }    // Primary Key
        public int VenueId { get; set; }         // Foreign key to Venue

        // ImageUrl should never be null → make it required
        public required string ImageUrl { get; set; }     // URL or path of the image

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property — may be null (optional relationship)
        public Venue? Venue { get; set; }
    }
}
