using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Tabela_Analises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Analyses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    WrittenUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    Laudo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnalysisType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsFinished = table.Column<bool>(type: "bit", nullable: false),
                    IsConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    ConfirmedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ConfirmationDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Analyses_AspNetUsers_AuthorizedUserId",
                        column: x => x.AuthorizedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Analyses_AspNetUsers_ConfirmedUserId",
                        column: x => x.ConfirmedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Analyses_AspNetUsers_WrittenUserId",
                        column: x => x.WrittenUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Analyses_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_AuthorizedUserId",
                table: "Analyses",
                column: "AuthorizedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_ConfirmedUserId",
                table: "Analyses",
                column: "ConfirmedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_ItemId",
                table: "Analyses",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_WrittenUserId",
                table: "Analyses",
                column: "WrittenUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analyses");
        }
    }
}
