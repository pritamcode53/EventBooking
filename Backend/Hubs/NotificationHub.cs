using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connections = new();

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                _connections[userId] = Context.ConnectionId;
                Console.WriteLine($"✅ User {userId} connected with ConnectionId {Context.ConnectionId}");
            }
            else
            {
                Console.WriteLine("⚠️ No userId found in query params!");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = _connections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(userId))
            {
                _connections.TryRemove(userId, out _);
                Console.WriteLine($"❌ User {userId} disconnected");
            }

            await base.OnDisconnectedAsync(exception);
        }

        // 🔹 Static helper to get connectionId by userId
        public static string? GetConnectionId(string userId)
        {
            _connections.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
