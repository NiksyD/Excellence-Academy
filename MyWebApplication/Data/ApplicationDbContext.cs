using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyWebApplication.Models;

namespace MyWebApplication.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<GatePass> GatePasses { get; set; }
        public DbSet<GatePassDocument> GatePassDocuments { get; set; }
        public DbSet<ActivityReservation> ActivityReservations { get; set; }
        public DbSet<LockerRequest> LockerRequests { get; set; }
        public DbSet<LockerRequestDocument> LockerRequestDocuments { get; set; }
        public DbSet<ActivityReservationDocument> ActivityReservationDocuments { get; set; }
    }
}
