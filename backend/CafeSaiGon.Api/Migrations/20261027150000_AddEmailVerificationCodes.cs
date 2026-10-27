using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using CafeSaiGon.Api.Data;

namespace CafeSaiGon.Api.Migrations;

[DbContext(typeof(CafeDbContext))]
[Migration("20261027150000_AddEmailVerificationCodes")]
public partial class AddEmailVerificationCodes : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(name: "EmailCodeHash", table: "Users", type: "TEXT", nullable: true);
        migrationBuilder.AddColumn<DateTime>(name: "EmailCodeExpiresUtc", table: "Users", type: "TEXT", nullable: true);
        migrationBuilder.AddColumn<DateTime>(name: "EmailCodeSentUtc", table: "Users", type: "TEXT", nullable: true);
        migrationBuilder.AddColumn<int>(name: "EmailCodeAttemptCount", table: "Users", type: "INTEGER", nullable: false, defaultValue: 0);
        migrationBuilder.AddColumn<DateTime>(name: "EmailCodeSendWindowUtc", table: "Users", type: "TEXT", nullable: true);
        migrationBuilder.AddColumn<int>(name: "EmailCodeSendCount", table: "Users", type: "INTEGER", nullable: false, defaultValue: 0);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "EmailCodeHash", table: "Users");
        migrationBuilder.DropColumn(name: "EmailCodeExpiresUtc", table: "Users");
        migrationBuilder.DropColumn(name: "EmailCodeSentUtc", table: "Users");
        migrationBuilder.DropColumn(name: "EmailCodeAttemptCount", table: "Users");
        migrationBuilder.DropColumn(name: "EmailCodeSendWindowUtc", table: "Users");
        migrationBuilder.DropColumn(name: "EmailCodeSendCount", table: "Users");
    }
}
