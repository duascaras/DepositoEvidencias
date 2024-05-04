using System.ComponentModel.DataAnnotations;

namespace WebAPI.Model
{
    public class EditUserPasswordModel
    {
        public required string Username { get; set; }

        [DataType(DataType.Password)]
        public required string NewPassword { get; set; }

        [DataType(DataType.Password)]
        public required string ConfirmedPassword { get; set; }
    }
}
