namespace back.Models;

public class PlatformSales
{
    public string Platform { get; set; } = string.Empty;
    public decimal GlobalSales { get; set; }
    public decimal NASales { get; set; }
    public decimal PALSales { get; set; }  // Changed from EUSales to PALSales
    public decimal JPSales { get; set; }
    public decimal OtherSales { get; set; }
    public int GameCount { get; set; }
}