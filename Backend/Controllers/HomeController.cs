// using Microsoft.AspNetCore.Mvc;
// using backend.Helpers;
// using backend.DTOs;
// using backend.Common;
// using System;
// using System.Collections.Generic;
// using System.Threading.Tasks;

// namespace backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class HomeController : ControllerBase
//     {
//         private readonly HomeHelper _helper;

//         public HomeController(HomeHelper helper)
//         {
//             _helper = helper;
//         }

//         /// <summary>
//         /// Get all venues
//         /// </summary>
//         [HttpGet("all")]
//         public async Task<IActionResult> GetAllVenues()
//         {
//             try
//             {
//                 var venues = await _helper.GetAllVenuesAsync();
//                 return Ok(ApiResponse<IEnumerable<VenueDetailsDto>>.Ok(venues));
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, ApiResponse<string>.Fail($"Error fetching venues: {ex.Message}"));
//             }
//         }
//     }
// }


using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.DTOs;
using backend.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        /// Get all venues with optional filters
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllVenues([FromQuery] VenueFilterDto filters)
        {
            try
            {
                var venues = await _helper.GetAllVenuesAsync(filters);
                return Ok(ApiResponse<IEnumerable<VenueDetailsDto>>.Ok(venues));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Fail($"Error fetching venues: {ex.Message}"));
            }
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllLocations()
        {
            try
            {
                var locations = await _helper.GetAllLocationsAsync();
                return Ok(ApiResponse<IEnumerable<string>>.Ok(locations));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Fail($"Error fetching locations: {ex.Message}"));
            }
        }

    }
}

