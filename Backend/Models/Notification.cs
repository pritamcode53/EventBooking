namespace backend.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }         // Owner or Customer
        public string Message { get; set; } = string.Empty;   // Notification text
        public bool IsRead { get; set; }        // Track if seen or not
        public DateTime CreatedAt { get; set; } // Timestamp
    }
}

