using Microsoft.AspNetCore.Identity;
using WebAPI.Entities;

namespace WebAPI.Services
{
    public class SeedUserRoleInitial : ISeedUserRoleInitial
    {
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SeedUserRoleInitial(UserManager<ExtendedIdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedRolesAsync()
        {
            if(!await _roleManager.RoleExistsAsync("Admin"))
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                IdentityResult roleResult = await _roleManager.CreateAsync(role);
            }

            if (!await _roleManager.RoleExistsAsync("User"))
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                IdentityResult roleResult = await _roleManager.CreateAsync(role);
            }
        }
        
        public async Task SeedUserAsync()
        {
            if(await _userManager.FindByNameAsync("Admin")== null)
            {
                ExtendedIdentityUser user = new ExtendedIdentityUser();
                user.UserName = "Admin";
                user.NormalizedUserName = "ADMIN";
                user.LockoutEnabled = false;
                user.IsActive = true;
                user.SecurityStamp = Guid.NewGuid().ToString();

                IdentityResult result = await _userManager.CreateAsync(user, "Admin#2024");

                if(result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }

    }
}
