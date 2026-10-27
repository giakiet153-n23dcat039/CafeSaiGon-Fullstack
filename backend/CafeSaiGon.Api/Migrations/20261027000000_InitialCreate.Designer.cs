using CafeSaiGon.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace CafeSaiGon.Api.Migrations;

[DbContext(typeof(CafeDbContext))]
[Migration("20261027000000_InitialCreate")]
public partial class InitialCreate
{
    protected override void BuildTargetModel(ModelBuilder modelBuilder)
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
#pragma warning restore 612, 618
    }
}
