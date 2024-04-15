using Microsoft.EntityFrameworkCore;
using WebAPI.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace WebAPI.Context
{
    public class ApiDbContext : IdentityDbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
                
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                UserName = "Admin",
                PasswordHash = "Admin",
                Role = "Admin"
            });
        }
    }
}
