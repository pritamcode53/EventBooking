using backend.Common.Enums;

namespace backend.Models
{
    public class Booking
    {
        public int BookingId { get; set; }        // Primary key
        public int VenueId { get; set; }          // Foreign key to Venue
        public int CustomerId { get; set; }       // Foreign key to User (Customer)
        public DateTime BookingDate { get; set; } // Date/time of the booking
        public PricingType TimeDuration { get; set; } // PerHour / PerDay / PerEvent

        public int DurationHours { get; set; } = 1;  // For PerHour and PerEvent
        public int DurationDays { get; set; } = 1;   // For PerDay

        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsPaid { get; set; } = false;

        // Navigation properties
        public Venue? Venue { get; set; }
        public User? Customer { get; set; }
    }
}
