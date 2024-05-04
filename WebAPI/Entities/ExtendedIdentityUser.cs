using Microsoft.AspNetCore.Identity;

namespace WebAPI.Entities
{
    public class ExtendedIdentityUser : IdentityUser
    {
        public bool IsActive { get; set; }
    }
}
