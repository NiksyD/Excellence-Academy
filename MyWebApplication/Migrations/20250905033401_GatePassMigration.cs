using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApplication.Migrations
{
    /// <inheritdoc />
    public partial class GatePassMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GatePasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Faculty = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CourseYear = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    VehiclePlateNo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RegistrationExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VehicleType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Maker = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    AttachedDocuments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GatePasses", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GatePasses");
        }
    }
}
