namespace WebAPI.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public ExtendedIdentityUser User { get; set; }
        public ExtendedIdentityUser ChangeUser { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ChangeDate { get; set; }
        public bool IsActive { get; set; }
    }
}
