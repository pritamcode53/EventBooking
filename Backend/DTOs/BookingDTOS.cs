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
        public string? VenueName { get; set; }
        public string? CustomerName { get; set; }

        public PricingType Type { get; set; }
        public int DurationDays { get; set; }
        public int DurationHours { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime BookingDate { get; set; }
        public BookingStatus Status { get; set; }

        // 🟢 New Fields for Partial Payments
        public string PaymentStatus { get; set; } = "Unpaid";  // Unpaid | Partial | Paid
        public decimal PaidAmount { get; set; } = 0.00m;
        public decimal DueAmount { get; set; } = 0.00m;
        public VenueDto? Venue { get; set; }
    }

    public class CancelBookingRequest
    {
        public string? CancelReason { get; set; }
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

        // 🟢 Include payment summary for frontend
        public string PaymentStatus { get; set; } = "Unpaid";
        public decimal PaidAmount { get; set; } = 0.00m;
        public decimal DueAmount { get; set; } = 0.00m;
    }
}
