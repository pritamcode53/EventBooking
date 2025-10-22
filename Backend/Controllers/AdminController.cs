using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    // [Authorize(Roles = "Admin")]  // Only admin users can access
    public class AdminController : ControllerBase
    {
        private readonly AdminHelper _helper;

        public AdminController(AdminHelper helper)
        {
            _helper = helper;
        }

        // GET: api/admin/owners
        [HttpGet("owners")]
        public async Task<IActionResult> GetOwners()
        {
            var owners = await _helper.GetAllOwnersAsync();
            return Ok(owners);
        }

        // GET: api/admin/venues
        [HttpGet("venues")]
        public async Task<IActionResult> GetVenues()
        {
            var venues = await _helper.GetAllVenuesAsync();
            return Ok(venues);
        }

        // GET: api/admin/bookings
        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings([FromQuery] string? status = null)
        {
            IEnumerable<object> bookings;

            if (!string.IsNullOrEmpty(status))
            {
                bookings = await _helper.GetBookingsByStatusAsync(status);
            }
            else
            {
                bookings = await _helper.GetAllBookingsAsync();
            }

            var totalCost = await _helper.GetTotalBookingCostAsync();
            var totalBookings = await _helper.GetTotalBookingsCountAsync();

            return Ok(new
            {
                TotalBookings = totalBookings,
                TotalCost = totalCost,
                Bookings = bookings
            });
        }

        // GET: api/admin/bookings/{id}
        [HttpGet("bookings/{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _helper.GetBookingByIdAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }
    }
}
