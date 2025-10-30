using backend.Common.Enums;
using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class RefundController : ControllerBase
{
    private readonly RefundHelper _refundHelper;
    private readonly UserHelper _userHelper;

    public RefundController(RefundHelper refundHelper, UserHelper userHelper)
    {
        _refundHelper = refundHelper;
        _userHelper = userHelper;
    }

    // Extract user ID from JWT cookie
    private int? GetUserIdFromToken()
    {
        if (!Request.Cookies.TryGetValue("jwtToken", out var token))
            return null;

        return _userHelper.ValidateToken(token);
    }

    // Verify venue owner authentication
    private async Task<int> GetAuthenticatedVenueOwnerIdAsync()
    {
        var userId = GetUserIdFromToken();
        if (userId == null)
            throw new UnauthorizedAccessException("User not authenticated");

        var user = await _userHelper.GetUserByIdAsync(userId.Value);
        if (user == null || user.Role != UserRole.VenueOwner)
            throw new UnauthorizedAccessException("Only venue owners can perform this action");

        return userId.Value;
    }

    // Process refund (Only VenueOwner can do this)
    [HttpPost("process")]
    public async Task<IActionResult> ProcessRefund([FromBody] RefundDTO refundDto)
    {
        try
        {

            var venueOwnerId = await GetAuthenticatedVenueOwnerIdAsync();

            var result = await _refundHelper.ProcessRefundAsync(refundDto, venueOwnerId);

            if (result)
                return Ok(new { message = "Refund processed successfully" });

            return BadRequest(new { message = "Refund processing failed" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    // [HttpGet("paid-cancelled")]
    // public async Task<IActionResult> GetPaidCancelledUsers([FromQuery] bool excludeRefunded = true)
    // {
    //     try
    //     {
    //         var users = await _refundHelper.GetPaidCancelledUsersAsync(excludeRefunded);
    //         return Ok(users);
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    //     }
    // }
    [HttpGet("refundable-users")]
    public async Task<IActionResult> GetPaidRejectedUsers([FromQuery] bool excludeRefunded = true)
    {
        try
        {
            var users = await _refundHelper.GetRefundableBookingsAsync(excludeRefunded);
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

}
