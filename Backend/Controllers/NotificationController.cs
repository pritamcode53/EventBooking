using Microsoft.AspNetCore.Mvc;
using backend.DAL;
using backend.Models;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationDAL _notificationDAL;

        public NotificationController(NotificationDAL notificationDAL)
        {
            _notificationDAL = notificationDAL;
        }

        // Get all unread notifications for a specific user
        [HttpGet("{userId}/unread")]
        public async Task<IActionResult> GetUnreadNotifications(int userId)
        {
            try
            {
                var notifications = await _notificationDAL.GetUnreadNotificationsAsync(userId);
                if (notifications == null || !notifications.Any())
                    return NotFound(new { message = "No unread notifications found." });

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching notifications.", error = ex.Message });
            }
        }

        // Get all notifications (read + unread) for a user
        [HttpGet("{userId}/all")]
        public async Task<IActionResult> GetAllNotifications(int userId)
        {
            try
            {
                var notifications = await _notificationDAL.GetAllNotificationsAsync(userId);
                if (notifications == null || !notifications.Any())
                    return NotFound(new { message = "No notifications found." });

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching all notifications.", error = ex.Message });
            }
        }

        // Mark a specific notification as read
        [HttpPut("read/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            try
            {
                await _notificationDAL.MarkAsReadAsync(notificationId);
                return Ok(new { message = "Notification marked as read." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating notification.", error = ex.Message });
            }
        }

        // (Optional) Add a manual notification for testing or admin actions
        [HttpPost("add")]
        public async Task<IActionResult> AddNotification([FromBody] NotificationCreateDto dto)
        {
            try
            {
                if (dto == null || dto.UserId <= 0 || string.IsNullOrEmpty(dto.Message))
                    return BadRequest(new { message = "Invalid input data." });

                await _notificationDAL.AddNotificationAsync(dto.UserId, dto.Message);
                return Ok(new { message = "Notification added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding notification.", error = ex.Message });
            }
        }
    }

    //  DTO for creating new notifications manually or from admin
    public class NotificationCreateDto
    {
        public int UserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
