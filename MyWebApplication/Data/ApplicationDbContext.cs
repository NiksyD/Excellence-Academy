using Microsoft.EntityFrameworkCore;
using MyWebApplication.Models;

namespace MyWebApplication.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<GatePass> GatePasses { get; set; }
    }
}
