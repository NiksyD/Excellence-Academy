using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApplication.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGatePassDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UploadDate",
                table: "GatePassDocuments",
                newName: "UploadedAt");

            migrationBuilder.RenameColumn(
                name: "OriginalFileName",
                table: "GatePassDocuments",
                newName: "StoredFileName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UploadedAt",
                table: "GatePassDocuments",
                newName: "UploadDate");

            migrationBuilder.RenameColumn(
                name: "StoredFileName",
                table: "GatePassDocuments",
                newName: "OriginalFileName");
        }
    }
}
