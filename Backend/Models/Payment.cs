public class Payment
{
    public int PaymentId { get; set; }        
    public int BookingId { get; set; }        
    public int VenueId { get; set; }        
    public decimal Amount { get; set; }       
    public string? PaymentMethod { get; set; } // e.g., "Credit Card", "UPI", "Cash"
    public string Status { get; set; } = "Pending"; // Payment status: "Pending", "Success", "Failed"
    public DateTime CreatedAt { get; set; } = DateTime.Now; // Timestamp
}
