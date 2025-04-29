// filepath: /home/kim/code/sql/project/archive/back/Models/VGChartz2024.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

public class VGChartz2024
{
    [Column("img")]
    public string Img { get; set; } = string.Empty;
    
    [Column("title")]
    public string Title { get; set; } = string.Empty;
    
    [Column("console")]
    public string Console { get; set; } = string.Empty;
    
    [Column("genre")]
    public string Genre { get; set; } = string.Empty;
    
    [Column("publisher")]
    public string Publisher { get; set; } = string.Empty;
    
    [Column("developer")]
    public string Developer { get; set; } = string.Empty;
    
    [Column("critic_score")]
    public decimal? CriticScore { get; set; }
    
    [Column("total_sales")]
    public decimal TotalSales { get; set; }
    
    [Column("na_sales")]
    public decimal NASales { get; set; }
    
    [Column("jp_sales")]
    public decimal JPSales { get; set; }
    
    [Column("pal_sales")]
    public decimal PALSales { get; set; }
    
    [Column("other_sales")]
    public decimal OtherSales { get; set; }
    
    [Column("release_date")]
    public DateTime? ReleaseDate { get; set; }
    
    [Column("last_update")]
    public DateTime? LastUpdate { get; set; }
}