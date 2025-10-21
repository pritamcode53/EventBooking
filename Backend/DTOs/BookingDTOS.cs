using backend.Common.Enums;
namespace backend.DTOs
{
    public class BookingCreateDto
    {
        public int VenueId { get; set; }
        public DateTime BookingDate { get; set; }
        public PricingType TimeDuration { get; set; }
        public int DurationHours { get; set; } = 1; // For PerHour and PerEvent
        public int DurationDays { get; set; } = 1;  // For PerDay
    }

     public class BookingDto
    {
        public int BookingId { get; set; }
        public int VenueId { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime BookingDate { get; set; }
        public BookingStatus Status { get; set; }
    }

    public class UpdateBookingStatusDto
    {
        public BookingStatus? Status { get; set; }
    }

    public class BookingResponseDto
    {
        public int BookingId { get; set; }
        public string VenueName { get; set; } = "";
        public DateTime BookingDate { get; set; }
        public PricingType TimeDuration { get; set; }
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
    }
}
