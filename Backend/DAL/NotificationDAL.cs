using backend.Models;
using Dapper;
using System.Data;

namespace backend.DAL
{
    public class NotificationDAL
    {
        private readonly IDbConnection _connection;

        public NotificationDAL(IDbConnection connection)
        {
            _connection = connection;
        }

        // ✅ Insert new notification
        public async Task AddNotificationAsync(int userId, string message)
        {
            string sql = @"INSERT INTO Notifications (UserId, Message, IsRead, CreatedAt)
                           VALUES (@UserId, @Message, FALSE, NOW())";
            await _connection.ExecuteAsync(sql, new { UserId = userId, Message = message });
        }

        // ✅ Fetch all unread notifications for a user
        public async Task<IEnumerable<Notification>> GetUnreadNotificationsAsync(int userId)
        {
            string sql = @"SELECT * FROM Notifications 
                           WHERE UserId = @UserId AND IsRead = FALSE 
                           ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Notification>(sql, new { UserId = userId });
        }

        // ✅ Mark a specific notification as read
        public async Task MarkAllAsReadAsync(int userId)
        {
            var query = "UPDATE Notifications SET IsRead = TRUE WHERE UserId = @UserId AND IsRead = FALSE";
            await _connection.ExecuteAsync(query, new { UserId = userId });
        }


        // ✅ (Optional) Fetch all notifications for a user (read + unread)
        public async Task<IEnumerable<Notification>> GetAllNotificationsAsync(int userId)
        {
            string sql = @"SELECT * FROM Notifications 
                           WHERE UserId = @UserId 
                           ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Notification>(sql, new { UserId = userId });
        }
    }
}
