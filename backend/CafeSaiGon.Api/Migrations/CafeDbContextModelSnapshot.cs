using System;
using CafeSaiGon.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable
namespace CafeSaiGon.Api.Migrations;

[DbContext(typeof(CafeDbContext))]
public partial class CafeDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder.HasAnnotation("ProductVersion", "10.0.0");

        modelBuilder.Entity("CafeSaiGon.Api.Models.Product", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasAnnotation("Sqlite:Autoincrement", true);

            b.Property<string>("BestFor")
                .IsRequired()
                .HasMaxLength(220)
                .HasColumnType("TEXT");

            b.Property<string>("Category")
                .IsRequired()
                .HasMaxLength(60)
                .HasColumnType("TEXT");

            b.Property<string>("Desc")
                .IsRequired()
                .HasMaxLength(1200)
                .HasColumnType("TEXT");

            b.Property<string>("Emoji")
                .IsRequired()
                .HasMaxLength(12)
                .HasColumnType("TEXT");

            b.Property<string>("Flavor")
                .IsRequired()
                .HasMaxLength(350)
                .HasColumnType("TEXT");

            b.Property<string>("ImageName")
                .IsRequired()
                .HasMaxLength(90)
                .HasColumnType("TEXT");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(120)
                .HasColumnType("TEXT");

            b.Property<long>("Price")
                .HasColumnType("INTEGER");

            b.Property<string>("Roast")
                .IsRequired()
                .HasMaxLength(80)
                .HasColumnType("TEXT");

            b.Property<string>("Weight")
                .IsRequired()
                .HasMaxLength(30)
                .HasColumnType("TEXT");

            b.HasKey("Id");
            b.ToTable("Products");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.AppUser", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("INTEGER").HasAnnotation("Sqlite:Autoincrement", true);
            b.Property<bool>("Approved").HasColumnType("INTEGER");
            b.Property<DateTime>("CreatedUtc").HasColumnType("TEXT");
            b.Property<string>("Email").IsRequired().HasMaxLength(255).HasColumnType("TEXT");
            b.Property<bool>("EmailConfirmed").HasColumnType("INTEGER");
            b.Property<int>("FailedAttempts").HasColumnType("INTEGER");
            b.Property<string>("FullName").IsRequired().HasColumnType("TEXT");
            b.Property<DateTime?>("LockoutEndUtc").HasColumnType("TEXT");
            b.Property<string>("PasswordHash").IsRequired().HasColumnType("TEXT");
            b.Property<string>("Role").IsRequired().HasMaxLength(20).HasColumnType("TEXT");
            b.Property<string>("EmailCodeHash").HasColumnType("TEXT");
            b.Property<DateTime?>("EmailCodeExpiresUtc").HasColumnType("TEXT");
            b.Property<DateTime?>("EmailCodeSentUtc").HasColumnType("TEXT");
            b.Property<int>("EmailCodeAttemptCount").HasColumnType("INTEGER");
            b.Property<DateTime?>("EmailCodeSendWindowUtc").HasColumnType("TEXT");
            b.Property<int>("EmailCodeSendCount").HasColumnType("INTEGER");
            b.Property<DateTime?>("VerificationExpiresUtc").HasColumnType("TEXT");
            b.Property<string>("VerificationTokenHash").HasColumnType("TEXT");
            b.HasKey("Id");
            b.HasIndex("Email").IsUnique();
            b.ToTable("Users");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.CafeOrder", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("INTEGER").HasAnnotation("Sqlite:Autoincrement", true);
            b.Property<DateTime?>("ApprovedUtc").HasColumnType("TEXT");
            b.Property<string>("Address").IsRequired().HasColumnType("TEXT");
            b.Property<DateTime>("CreatedUtc").HasColumnType("TEXT");
            b.Property<int>("CustomerId").HasColumnType("INTEGER");
            b.Property<string>("CustomerName").IsRequired().HasColumnType("TEXT");
            b.Property<string>("Note").IsRequired().HasColumnType("TEXT");
            b.Property<string>("Phone").IsRequired().HasColumnType("TEXT");
            b.Property<int?>("StaffId").HasColumnType("INTEGER");
            b.Property<string>("Status").IsRequired().HasColumnType("TEXT");
            b.HasKey("Id");
            b.HasIndex("CustomerId");
            b.HasIndex("StaffId");
            b.ToTable("Orders");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.CafeOrderItem", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("INTEGER").HasAnnotation("Sqlite:Autoincrement", true);
            b.Property<int>("CafeOrderId").HasColumnType("INTEGER");
            b.Property<int>("ProductId").HasColumnType("INTEGER");
            b.Property<string>("ProductName").IsRequired().HasColumnType("TEXT");
            b.Property<int>("Quantity").HasColumnType("INTEGER");
            b.Property<long>("UnitPrice").HasColumnType("INTEGER");
            b.HasKey("Id");
            b.HasIndex("CafeOrderId");
            b.ToTable("OrderItems");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.CafeOrder", b =>
        {
            b.HasOne("CafeSaiGon.Api.Models.AppUser", "Customer")
                .WithMany().HasForeignKey("CustomerId").OnDelete(DeleteBehavior.Restrict).IsRequired();
            b.HasOne("CafeSaiGon.Api.Models.AppUser", "Staff")
                .WithMany().HasForeignKey("StaffId").OnDelete(DeleteBehavior.Restrict);
            b.Navigation("Customer");
            b.Navigation("Staff");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.CafeOrderItem", b =>
        {
            b.HasOne("CafeSaiGon.Api.Models.CafeOrder", "CafeOrder")
                .WithMany("Items").HasForeignKey("CafeOrderId").OnDelete(DeleteBehavior.Cascade).IsRequired();
            b.Navigation("CafeOrder");
        });

        modelBuilder.Entity("CafeSaiGon.Api.Models.CafeOrder", b => b.Navigation("Items"));
#pragma warning restore 612, 618
    }
}
