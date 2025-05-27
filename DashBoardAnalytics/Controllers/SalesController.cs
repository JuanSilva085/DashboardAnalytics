using Microsoft.AspNetCore.Mvc;
using DashBoardAnalytics.Models;
using DashBoardAnalytics.Data;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Globalization;

namespace DashBoardAnalytics.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly DashboardDbContext _context;

    //Construtor que inicia o serviço de vendas
    public SalesController(DashboardDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sale>>> Get()
    {
        var sales = await _context.Sales.ToListAsync();
        return Ok(sales);
    }

    [HttpPost]
    public async Task<ActionResult<Sale>> Post([FromBody] Sale sale)
    {
        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id=sale.Id }, sale);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<Summary>>> GetSummary()
    {
        var summary = await _context.Sales
            .GroupBy(x => x.Date.Month)
            .Select(g => new Summary
            {
                Month = g.Key,
                MonthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                Total = g.Sum(x => x.Total)
            })
              .OrderBy(x => x.Month)
              .ToListAsync();

            return Ok(summary);
    }
}
