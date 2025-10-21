using backend.Common.Enums;

namespace backend.DTOs
{
    public class UserUpdateDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public UserRole? Role { get; set; }
    }
}
