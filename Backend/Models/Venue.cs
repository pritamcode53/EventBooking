using System.Collections.Generic;

namespace backend.Models
{
    public class Venue
    {
        public int VenueId { get; set; }

        // These fields should never be null, so mark them as 'required'
        public required string Name { get; set; }
        public required string Location { get; set; }

        public int Capacity { get; set; }

        // Description can be optional (nullable)
        public string? Description { get; set; }
        public string? Images { get; set; }
        public int OwnerId { get; set; }
        public decimal? PerHour { get; set; }
        public decimal? PerDay { get; set; }
        public decimal? PerEvent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public List<VenueImage> VenueImages { get; set; } = new List<VenueImage>();
        public List<VenuePricing> VenuePricings { get; set; } = new List<VenuePricing>();
    }
}
