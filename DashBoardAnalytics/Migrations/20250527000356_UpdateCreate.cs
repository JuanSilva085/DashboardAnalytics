using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DashBoardAnalytics.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Month",
                table: "Sales",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Sales",
                newName: "Month");
        }
    }
}
