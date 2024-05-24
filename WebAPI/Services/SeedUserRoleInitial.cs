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

            if (!await _roleManager.RoleExistsAsync("ItemAnalyzer"))
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "ItemAnalyzer",
                    NormalizedName = "ITEMANALYZER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                IdentityResult roleResult = await _roleManager.CreateAsync(role);
            }

            if (!await _roleManager.RoleExistsAsync("ItemCreator"))
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "ItemCreator",
                    NormalizedName = "ITEMCREATOR",
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

            if (await _userManager.FindByNameAsync("Analyzer") == null)
            {
                ExtendedIdentityUser user = new ExtendedIdentityUser();
                user.UserName = "Analyzer";
                user.NormalizedUserName = "ANALYZER";
                user.LockoutEnabled = false;
                user.IsActive = true;
                user.SecurityStamp = Guid.NewGuid().ToString();

                IdentityResult result = await _userManager.CreateAsync(user, "Analyzer#2024");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "ItemAnalyzer");
                }
            }

            if (await _userManager.FindByNameAsync("Creator") == null)
            {
                ExtendedIdentityUser user = new ExtendedIdentityUser();
                user.UserName = "Creator";
                user.NormalizedUserName = "CREATOR";
                user.LockoutEnabled = false;
                user.IsActive = true;
                user.SecurityStamp = Guid.NewGuid().ToString();

                IdentityResult result = await _userManager.CreateAsync(user, "Creator#2024");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "ItemCreator");
                }
            }
        }

    }
}
