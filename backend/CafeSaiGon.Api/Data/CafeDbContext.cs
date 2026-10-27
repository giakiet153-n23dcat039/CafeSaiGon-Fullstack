using CafeSaiGon.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeSaiGon.Api.Data;

public class CafeDbContext(DbContextOptions<CafeDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<CafeOrder> Orders => Set<CafeOrder>();
    public DbSet<CafeOrderItem> OrderItems => Set<CafeOrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(e => { e.HasIndex(x => x.Email).IsUnique(); e.Property(x => x.Email).HasMaxLength(255); e.Property(x => x.Role).HasMaxLength(20); });
        modelBuilder.Entity<CafeOrder>(e => { e.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict); e.HasOne(x => x.Staff).WithMany().HasForeignKey(x => x.StaffId).OnDelete(DeleteBehavior.Restrict); });
        modelBuilder.Entity<CafeOrderItem>(e => { e.HasOne(x => x.CafeOrder).WithMany(x => x.Items).HasForeignKey(x => x.CafeOrderId); });
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Category).HasMaxLength(60).IsRequired();
            entity.Property(x => x.Weight).HasMaxLength(30).IsRequired();
            entity.Property(x => x.Emoji).HasMaxLength(12);
            entity.Property(x => x.Roast).HasMaxLength(80);
            entity.Property(x => x.Flavor).HasMaxLength(350);
            entity.Property(x => x.Desc).HasMaxLength(1200);
            entity.Property(x => x.BestFor).HasMaxLength(220);
            entity.Property(x => x.ImageName).HasMaxLength(90);
            entity.Property(x => x.Price).HasColumnType("INTEGER");
        });
    }
}
