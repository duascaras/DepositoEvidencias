namespace WebAPI.Entities
{
    public class UserItemCode
    {
        public int id { get; set; }
        public ExtendedIdentityUser User { get; set; }
        public Item Item { get; set; }
        public string Code { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
