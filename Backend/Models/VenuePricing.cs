using backend.Common.Enums;

namespace backend.Models
{
    public class VenuePricing
    {
        public int VenuePricingId { get; set; }   // Primary Key
        public int VenueId { get; set; }          // Foreign Key to Venue

        public PricingType Type { get; set; }     // Enum: PerHour / PerDay
        public decimal Price { get; set; }        // Price value

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


        // Navigation property (optional)
        public Venue? Venue { get; set; }
    }
}
