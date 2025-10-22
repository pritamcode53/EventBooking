namespace backend.DTOs
{
    public class VenueOwnerDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
    public class VenueDto
    {
        public int VenueId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
    }
}
