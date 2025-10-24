namespace backend.DTOs
{
    public class CancelledBookingDto
{
    public int BookingId { get; set; }
    public int VenueId { get; set; }
    public int CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? UEmail { get; set; }
    public DateTime BookingDate { get; set; }
    public string TimeDuration { get; set; } = string.Empty;
    public int DurationHours { get; set; }
    public int DurationDays { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsPaid { get; set; }
    public string CancelReason { get; set; } = string.Empty;
}

}