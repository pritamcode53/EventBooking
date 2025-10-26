using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using backend.Common.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VenueController : ControllerBase
    {
        private readonly VenueHelper _helper;
        private readonly UserHelper _userHelper;

        public VenueController(VenueHelper helper, UserHelper userHelper)
        {
            _helper = helper;
            _userHelper = userHelper;
        }

        // ---------------- Create Venue ----------------
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateVenue([FromBody] Venue venue)
        {
            int? userId = GetUserIdFromToken();
            if (userId == null || !await IsVenueOwnerAsync(userId.Value))
                return Forbid("Only VenueOwner can create venue");

            var venueId = await _helper.AddVenueAsync(venue, userId.Value);
            return Ok(new { VenueId = venueId, Message = "Venue created successfully" });
        }

        // ---------------- Update Venue ----------------
        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateVenue(int id, [FromBody] VenueUpdateDto dto)
        {
            int? userId = GetUserIdFromToken();
            if (userId == null || !await IsVenueOwnerAsync(userId.Value))
                return Forbid("Only VenueOwner can update venue");

            var result = await _helper.UpdateVenueAsync(id, dto, userId.Value);
            if (result == 0) return NotFound("Venue not found or not yours");
            return Ok("Venue updated successfully");
        }

        // ---------------- Delete Venue ----------------
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteVenue(int id)
        {
            int? userId = GetUserIdFromToken();
            if (userId == null || !await IsVenueOwnerAsync(userId.Value))
                return Forbid("Only VenueOwner can delete venue");

            var result = await _helper.DeleteVenueAsync(id, userId.Value);
            if (result == 0) return NotFound("Venue not found or not yours");
            return Ok("Venue deleted successfully");
        }

        // ---------------- Add Images ----------------
        [Authorize]
        [HttpPost("{venueId}/images")]
        public async Task<IActionResult> AddImages(int venueId, [FromForm] List<IFormFile> files)
        {
            int? userId = GetUserIdFromToken();
            if (userId == null || !await IsVenueOwnerAsync(userId.Value)) return Forbid();

            var ids = await _helper.AddVenueImagesAsync(files, venueId);
            return Ok(new { Message = "Images uploaded successfully", ImageIds = ids });
        }

        // ---------------- Add Pricing ----------------
        [Authorize]
        [HttpPost("{venueId}/pricing")]
        public async Task<IActionResult> AddPricing(int venueId, [FromBody] VenuePricing pricing)
        {
            int? userId = GetUserIdFromToken();
            if (userId == null || !await IsVenueOwnerAsync(userId.Value)) return Forbid();

            pricing.VenueId = venueId;
            pricing.CreatedAt = DateTime.UtcNow;
            await _helper.AddVenuePricingAsync(pricing, userId.Value);
            return Ok("Pricing added successfully");
        }

        // ---------------- Update Pricing ----------------
        [Authorize]
        [HttpPut("{venueId}/pricing/update")]
        public async Task<IActionResult> UpdateVenuePricing(int venueId, [FromBody] List<VenuePricingUpdateDto> pricings)
        {
            if (pricings == null || !pricings.Any())
                return BadRequest("No pricing data provided");

            int ownerId = await GetAuthenticatedOwnerIdAsync();
            int successCount = 0;

            foreach (var p in pricings)
            {
                // Update by venueId + type
                var result = await _helper.UpdateVenuePricingAsync(
                    venueId,      // the venue ID
                    p.Type,       // PricingType from your DTO
                    p.Price,      // new price
                    ownerId       // THIS was missing
                );

                Console.WriteLine($"Updating VenueId: {venueId}, Type: {p.Type}, Price: {p.Price}");

                if (result > 0)
                    successCount++;
            }

            return Ok(new
            {
                message = $"{successCount} venue pricing record(s) updated successfully",
                totalRequested = pricings.Count
            });
        }

        // ---------------- Get Venues by Owner ----------------
        [Authorize]
        [HttpGet("owner")]
        public async Task<IActionResult> GetOwnerVenues()
        {
            try
            {
                int ownerId = await GetAuthenticatedOwnerIdAsync();
                IEnumerable<Venue> venues = await _helper.GetVenuesByOwnerAsync(ownerId);
                return Ok(venues);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong", detail = ex.Message });
            }
        }

        // ------------------ Helper Methods ------------------
        private int? GetUserIdFromToken()
        {
            if (!Request.Cookies.TryGetValue("jwtToken", out var token)) return null;
            return _userHelper.ValidateToken(token);
        }

        private async Task<bool> IsVenueOwnerAsync(int userId)
        {
            var user = await _userHelper.GetUserByIdAsync(userId);
            return user != null && user.Role == UserRole.VenueOwner;
        }

        private async Task<int> GetAuthenticatedOwnerIdAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) throw new UnauthorizedAccessException("User not authenticated");

            var user = await _userHelper.GetUserByIdAsync(userId.Value);
            if (user == null || user.Role != UserRole.VenueOwner)
                throw new UnauthorizedAccessException("Only venue owners can perform this action");

            return userId.Value;
        }
    }
}
