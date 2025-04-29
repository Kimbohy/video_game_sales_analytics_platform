// filepath: /home/kim/code/sql/project/archive/back/Models/FilteredData.cs
namespace back.Models;

public class FilteredData
{
    public IEnumerable<PlatformSales> PlatformSales { get; set; } = new List<PlatformSales>();
    public IEnumerable<GenreSales> GenreData { get; set; } = new List<GenreSales>();
    public IEnumerable<YearSales> TimelineData { get; set; } = new List<YearSales>();
}