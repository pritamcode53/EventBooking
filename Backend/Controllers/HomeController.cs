using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.DTOs;
using backend.Common;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly HomeHelper _helper;

        public HomeController(HomeHelper helper)
        {
            _helper = helper;
        }

        /// <summary>
        /// Get all venues for the home page (with optional filters)
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllVenues([FromQuery] VenueFilterDto filters)
        {
            try
            {
                var venues = await _helper.GetAllVenuesAsync(filters);
                // Use Ok() static method from ApiResponse
                return Ok(ApiResponse<IEnumerable<VenueDetailsDto>>.Ok(venues));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Fail($"Error fetching venues: {ex.Message}"));
            }
        }
    }
}
