using CafeSaiGon.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace CafeSaiGon.Api.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                Id = table.Column<int>(type: "INTEGER", nullable: false)
                    .Annotation("Sqlite:Autoincrement", true),
                Name = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                Category = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                Emoji = table.Column<string>(type: "TEXT", maxLength: 12, nullable: false),
                Weight = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                Price = table.Column<long>(type: "INTEGER", nullable: false),
                Roast = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                Flavor = table.Column<string>(type: "TEXT", maxLength: 350, nullable: false),
                Desc = table.Column<string>(type: "TEXT", maxLength: 1200, nullable: false),
                BestFor = table.Column<string>(type: "TEXT", maxLength: 220, nullable: false),
                ImageName = table.Column<string>(type: "TEXT", maxLength: 90, nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Products", x => x.Id));

        // 6 sản phẩm được đưa vào database đúng một lần bởi migration.
        migrationBuilder.InsertData(
            table: "Products",
            columns: new[] { "Id", "Category", "Name", "Emoji", "Weight", "Price", "Roast", "Flavor", "Desc", "BestFor", "ImageName" },
            values: new object[,]
            {
                { 1, "Cà phê rang", "Robusta Buôn Ma Thuột", "☕", "500g", 135000L, "Rang đậm", "Đắng đậm, hậu ngọt, hương cacao và hạt rang, body dày", "Robusta nguyên chất từ vùng đất đỏ bazan Buôn Ma Thuột. Phù hợp pha phin, uống đá và làm bạc xỉu.", "Pha phin, cà phê sữa đá", "robusta-bmt" },
                { 2, "Cà phê rang", "Arabica Cầu Đất", "🌿", "250g", 150000L, "Rang vừa", "Chua thanh, hương hoa và trái cây, ít đắng, hậu vị sạch", "Arabica trồng ở độ cao khoảng 1.500m tại Cầu Đất, Đà Lạt. Hương thơm tinh tế, hợp người thích vị nhẹ.", "Pour over, phin nhẹ, uống nóng không đường", "arabica-cau-dat" },
                { 3, "Cà phê rang", "Moka Cầu Đất", "🌸", "250g", 175000L, "Rang vừa", "Thơm nồng, chua nhẹ, hương hoa, hậu ngọt kéo dài", "Giống Moka nổi tiếng của Đà Lạt, sản lượng ít nên giá cao hơn. Thích hợp để thưởng thức riêng.", "Pour over, uống nóng", "moka-cau-dat" },
                { 4, "Cà phê rang", "Culi nguyên chất", "🫘", "500g", 160000L, "Rang đậm", "Rất đậm, mạnh, đắng gọn, hương caramel cháy", "Culi là hạt tròn đơn nằm một mình trong quả cà phê, cho vị đậm đặc và mạnh hơn hạt thường.", "Pha phin đậm, cà phê đen đá", "culi" },
                { 5, "Cà phê rang", "Blend Sài Gòn", "🏙️", "500g", 145000L, "Rang vừa đậm", "Cân bằng giữa đắng và béo, thơm hạt rang, dễ uống", "Phối trộn 70% Robusta và 30% Arabica, là vị cà phê quen thuộc của quán, vừa đậm vừa thơm.", "Mọi cách pha, phù hợp dùng hằng ngày", "blend-sai-gon" },
                { 6, "Pha sẵn", "Cold Brew chai 500ml", "🧊", "500ml", 85000L, "Ủ lạnh 16 giờ", "Êm, ngọt dịu, ít chua đắng, hương cacao", "Cà phê ủ lạnh từ Arabica và Robusta, đóng chai sẵn. Dùng trong 5 ngày khi bảo quản lạnh.", "Uống liền, thêm sữa tươi hoặc nước cam", "cold-brew" }
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Products");
    }
}
