using System;
using backend.Common.Enums;

namespace backend.Models
{
    public class CustomBookingRequest
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public PricingType Type { get; set; }
        public string Requirements { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}