namespace DashBoardAnalytics.Models;

public class Sale
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public DateTime Date { get; set; }
    public int Month => Date.Month;

    public string MonthName => Date.ToString("MMMM"); // "May", "June", "July"

}

