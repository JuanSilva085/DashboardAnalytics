using Microsoft.EntityFrameworkCore;
using DashBoardAnalytics.Models;

namespace DashBoardAnalytics.Data;

public class DashboardDbContext : DbContext
{
    public DashboardDbContext(DbContextOptions<DashboardDbContext> options) : base(options) { }

    public DbSet<Sale> Sales { get; set; }
}
