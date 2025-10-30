namespace backend.DTOs.CustomBooking
{
    public class CustomBookingCreateDto
    {
        public int Type { get; set; }
        public string Requirements { get; set; } = string.Empty;
    }
    public class CustomBookingResponseDto
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public int Type { get; set; }   
        public string Requirements { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
