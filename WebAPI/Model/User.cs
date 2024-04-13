namespace WebAPI.Model
{
    public class User
    {
        public int Id { get; set; }
        public string UsarName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; }
    }
}
