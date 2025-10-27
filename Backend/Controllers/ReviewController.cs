using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewHelper _helper;
        private readonly UserHelper _userHelper;

        public ReviewController(ReviewHelper helper, UserHelper userHelper)
        {
            _helper = helper;
            _userHelper = userHelper;
        }

        private int? GetUserIdFromToken()
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token)) return null;
            return _userHelper.ValidateToken(token);
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddReview([FromForm] ReviewCreateDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var reviewId = await _helper.AddReviewAsync(dto, userId.Value);
            return Ok(new { ReviewId = reviewId, Message = "Review submitted successfully" });
        }

        [HttpGet("venue/{venueId}")]
        public async Task<IActionResult> GetReviewsByVenue(int venueId)
        {
            var reviews = await _helper.GetVenueReviewsAsync(venueId);
            return Ok(reviews);
        }

        [HttpGet("average-ratings")]
        public async Task<IActionResult> GetAverageRatingsForAllVenues()
        {
            var averageRatings = await _helper.GetAverageRatingByVenueAsync();
            return Ok(averageRatings);
        }

    }
}
