using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using CafeSaiGon.Api.Data;
namespace CafeSaiGon.Api.Migrations;
[DbContext(typeof(CafeDbContext))]
[Migration("20261027010000_AddAccountsOrders")]
public partial class AddAccountsOrders : Migration {
 protected override void Up(MigrationBuilder m){
  m.CreateTable(name:"Users",columns:t=>new{Id=t.Column<int>(nullable:false).Annotation("Sqlite:Autoincrement",true),Email=t.Column<string>(maxLength:255,nullable:false),FullName=t.Column<string>(nullable:false),PasswordHash=t.Column<string>(nullable:false),Role=t.Column<string>(maxLength:20,nullable:false),EmailConfirmed=t.Column<bool>(nullable:false),Approved=t.Column<bool>(nullable:false),FailedAttempts=t.Column<int>(nullable:false),LockoutEndUtc=t.Column<DateTime>(nullable:true),VerificationTokenHash=t.Column<string>(nullable:true),VerificationExpiresUtc=t.Column<DateTime>(nullable:true),CreatedUtc=t.Column<DateTime>(nullable:false)},constraints:t=>t.PrimaryKey("PK_Users",x=>x.Id));
  m.CreateIndex(name:"IX_Users_Email",table:"Users",column:"Email",unique:true);
  m.CreateTable(name:"Orders",columns:t=>new{Id=t.Column<int>(nullable:false).Annotation("Sqlite:Autoincrement",true),CustomerId=t.Column<int>(nullable:false),StaffId=t.Column<int>(nullable:true),CustomerName=t.Column<string>(nullable:false),Phone=t.Column<string>(nullable:false),Address=t.Column<string>(nullable:false),Note=t.Column<string>(nullable:false),Status=t.Column<string>(nullable:false),CreatedUtc=t.Column<DateTime>(nullable:false),ApprovedUtc=t.Column<DateTime>(nullable:true)},constraints:t=>{t.PrimaryKey("PK_Orders",x=>x.Id);t.ForeignKey("FK_Orders_Users_CustomerId",x=>x.CustomerId,"Users","Id",onDelete:ReferentialAction.Restrict);t.ForeignKey("FK_Orders_Users_StaffId",x=>x.StaffId,"Users","Id",onDelete:ReferentialAction.Restrict);});
  m.CreateIndex(name:"IX_Orders_CustomerId",table:"Orders",column:"CustomerId");m.CreateIndex(name:"IX_Orders_StaffId",table:"Orders",column:"StaffId");
  m.CreateTable(name:"OrderItems",columns:t=>new{Id=t.Column<int>(nullable:false).Annotation("Sqlite:Autoincrement",true),CafeOrderId=t.Column<int>(nullable:false),ProductId=t.Column<int>(nullable:false),ProductName=t.Column<string>(nullable:false),Quantity=t.Column<int>(nullable:false),UnitPrice=t.Column<long>(nullable:false)},constraints:t=>{t.PrimaryKey("PK_OrderItems",x=>x.Id);t.ForeignKey("FK_OrderItems_Orders_CafeOrderId",x=>x.CafeOrderId,"Orders","Id",onDelete:ReferentialAction.Cascade);});
  m.CreateIndex(name:"IX_OrderItems_CafeOrderId",table:"OrderItems",column:"CafeOrderId");
 }
 protected override void Down(MigrationBuilder m){m.DropTable("OrderItems");m.DropTable("Orders");m.DropTable("Users");}
}
