namespace WebAPI.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public ExtendedIdentityUser User { get; set; } = default!;
        public ExtendedIdentityUser? ChangeUser { get; set; }
        public string Name { get; set; } = default!;
        public string Code { get; set; } = default!;
        public DateTime CreateDate { get; set; } = default!;
        public DateTime? ChangeDate { get; set; }
        public bool IsActive { get; set; }
        public bool InAnalysis { get; set; }
    }
}
