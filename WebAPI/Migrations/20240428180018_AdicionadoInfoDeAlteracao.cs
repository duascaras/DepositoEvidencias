using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AdicionadoInfoDeAlteracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ChangeDate",
                table: "Items",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ChangeUserId",
                table: "Items",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_ChangeUserId",
                table: "Items",
                column: "ChangeUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_AspNetUsers_ChangeUserId",
                table: "Items",
                column: "ChangeUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_AspNetUsers_ChangeUserId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_ChangeUserId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ChangeDate",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ChangeUserId",
                table: "Items");
        }
    }
}
