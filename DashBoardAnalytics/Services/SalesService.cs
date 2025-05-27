using DashBoardAnalytics.Models;

namespace DashBoardAnalytics.Services;
public class SalesService
{
    public List<Sale> GetSales()
    {
        return new List<Sale>
        {
            new Sale { Id = 1, Description = "Venda Maio", Total = 100, Date = new DateTime(2025, 5, 1) },
            new Sale { Id = 2, Description = "Venda Junho", Total = 295, Date = new DateTime(2025, 6, 1) },
            new Sale { Id = 3, Description = "Venda Julho", Total = 350, Date = new DateTime(2025, 7, 1) }
        };
    }
}
