using System.ComponentModel.DataAnnotations;

namespace WebAPI.Model
{
    public class RegisterModel
    {
        public required string UserName { get; set; }

        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
    
}
