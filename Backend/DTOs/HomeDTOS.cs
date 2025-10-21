namespace backend.DTOs
{
    public class VenueFilterDto
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Location { get; set; }
        public int? MinCapacity { get; set; }
        public int? MaxCapacity { get; set; }
    }

    public class VenueDetailsDto
    {
        public int VenueId { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public int Capacity { get; set; }
        public string? Description { get; set; }

        public List<VenuePricingDto> Pricings { get; set; } = new(); // replace single price

        public List<string> Images { get; set; } = new();
        public List<ReviewDto> Reviews { get; set; } = new();
    }

    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = string.Empty;
    }
}
