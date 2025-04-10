namespace back.Models;

public class VideoGame
{
    public int Rank { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public int? Year { get; set; }
    public string Genre { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public decimal NA_Sales { get; set; }
    public decimal EU_Sales { get; set; }
    public decimal JP_Sales { get; set; }
    public decimal Other_Sales { get; set; }
    public decimal Global_Sales { get; set; }
}