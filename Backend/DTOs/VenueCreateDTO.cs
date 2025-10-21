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
    
//     public class VenueFilterDto
// {
//     public string? Location { get; set; }

//     // The numeric enum from query string (0 = PerHour, 1 = PerDay, 2 = PerEvent)
//     public PricingType? Type { get; set; } 

//     // Optional: string input from frontend if you want to support names like "PerHour"
//     public string? TypeString { get; set; } 

//     public decimal? MinPrice { get; set; }
//     public decimal? MaxPrice { get; set; }

//     // Convenience method to parse TypeString into numeric enum
//     public void ParseTypeString()
//     {
//         if (!string.IsNullOrEmpty(TypeString) && Enum.TryParse(TypeString, true, out PricingType parsed))
//         {
//             Type = parsed;
//         }
//     }
}

