using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApplication.Migrations
{
    /// <inheritdoc />
    public partial class ActivityReservationMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActivityReservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FormDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActivityTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateNeeded = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeFrom = table.Column<TimeSpan>(type: "time", nullable: false),
                    TimeTo = table.Column<TimeSpan>(type: "time", nullable: false),
                    Participants = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Speaker = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PurposeObjective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EquipmentFacilitiesNeeded = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureOfActivity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SourceOfFunds = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AttachedDocuments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityReservations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityReservations");
        }
    }
}
