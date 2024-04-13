namespace WebAPI.Model
{
    public class UserDto
    {
        public int Id { get; set; }
        public required string UsarName { get; set; } = string.Empty;
        public required string Password { get; set; } = string.Empty;
    }
}