namespace backend.Common.Enums
{
    public enum BookingStatus
    {
        Pending,    // When customer creates a booking request
        Approved,   // Admin or VenueOwner approved
        Rejected,   // Admin or VenueOwner rejected
        Cancelled   // Customer cancelled
    }
}
