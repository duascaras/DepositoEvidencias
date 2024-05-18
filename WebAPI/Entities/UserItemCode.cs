namespace WebAPI.Entities
{
    public class UserItemCode
    {
        public int id { get; set; }
        public ExtendedIdentityUser User { get; set; } = default!;
        public Item Item { get; set; } = default!;
        public string Code { get; set; } = default!;
        public DateTime ExpireDate { get; set; }
    }
}
