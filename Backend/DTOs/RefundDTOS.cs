public class RefundDTO
{
    public int BookingId { get; set; }
    public int? CancelledId { get; set; }
     public int CustomerId { get; set; }
    public int VenueId { get; set; }
    public decimal RefundAmount { get; set; }
    public string? Remarks { get; set; }
}
