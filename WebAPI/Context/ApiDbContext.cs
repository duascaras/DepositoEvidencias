using Microsoft.EntityFrameworkCore;
using WebAPI.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace WebAPI.Context
{
    public class ApiDbContext : IdentityDbContext<ExtendedIdentityUser>
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
                
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }

    }
}
