namespace backend.DTOs
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int BookingId { get; set; }
        public int VenueId { get; set; }
        public decimal Amount { get; set; }

        // Assign default values to avoid null warnings
        public string PaymentMethod { get; set; } = "Credit Card";
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PaymentRequestDto
    {
        public int BookingId { get; set; }

        // Default to "Credit Card"
        public string PaymentMethod { get; set; } = "Credit Card";
    }
}
