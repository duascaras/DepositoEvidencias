namespace WebAPI.Model
{
    public class EditOwnerPasswordModel
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
        public required string ConfirmedPassword { get; set; }
    }
}
