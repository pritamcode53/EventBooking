public class Refund
{
    public int RefundId { get; set; }
    public int BookingId { get; set; }
    public int? CancelledId { get; set; }
    public decimal RefundAmount { get; set; }
    public DateTime RefundDate { get; set; }
    public string RefundStatus { get; set; } = "Pending";
    public int RefundedBy { get; set; }
    public string? Remarks { get; set; }
}
