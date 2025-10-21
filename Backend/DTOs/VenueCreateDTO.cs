using backend.Common.Enums;
namespace backend.DTOs
{
    public class VenueCreateDto
    {
        public required string Name { get; set; }
        public required string Location { get; set; }
        public required int Capacity { get; set; }
        public string? Description { get; set; }

        // Optional: Images (as URLs or base64)
        public List<string>? ImageUrls { get; set; }

        // Optional: Pricing info
        public List<VenuePricingDto>? Pricings { get; set; }
    }

    public class VenuePricingDto
    {
        public PricingType Type { get; set; }  // "PerHour" or "PerDay"
        public decimal Price { get; set; }
    }


}
