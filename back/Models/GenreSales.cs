namespace back.Models;

public class GenreSales
{
    public string Genre { get; set; } = string.Empty;
    public decimal TotalSales { get; set; }
    public int GameCount { get; set; }
}