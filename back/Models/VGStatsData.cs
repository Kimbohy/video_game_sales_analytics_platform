// filepath: /home/kim/code/sql/project/archive/back/Models/VGStatsData.cs
namespace back.Models;

public class VGStatsData
{
    public int TotalGames { get; set; }
    public int TotalConsoles { get; set; }
    public int TotalGenres { get; set; }
    public int TotalPublishers { get; set; }
    public int TotalDevelopers { get; set; }
    public decimal TotalSales { get; set; }
    public decimal AverageSales { get; set; }
    public decimal MaxSales { get; set; }
    public decimal MinSales { get; set; }
    public decimal AverageCriticScore { get; set; }
}