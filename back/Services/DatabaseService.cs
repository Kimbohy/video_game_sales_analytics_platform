using MySql.Data.MySqlClient;
using Dapper;
using back.Models;

namespace back.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            
        // Replace environment variable placeholders with actual values
        _connectionString = connectionString
            .Replace("${SQL_SERVER}", Environment.GetEnvironmentVariable("SQL_SERVER") ?? "")
            .Replace("${SQL_DATABASE}", Environment.GetEnvironmentVariable("SQL_DATABASE") ?? "")
            .Replace("${SQL_LOGIN}", Environment.GetEnvironmentVariable("SQL_LOGIN") ?? "")
            .Replace("${SQL_PASSWORD}", Environment.GetEnvironmentVariable("SQL_PASSWORD") ?? "")
            .Replace("${SQL_ALLOW_LOCAL_INFILE}", Environment.GetEnvironmentVariable("SQL_ALLOW_LOCAL_INFILE") ?? "");
    }

    public async Task<IEnumerable<VideoGame>> GetTopSellingGamesAsync(int limit = 10)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales ORDER BY Global_Sales DESC LIMIT @Limit", 
            new { Limit = limit });
    }

    public async Task<IEnumerable<VideoGame>> GetGamesByPlatformAsync(string platform)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Platform = @Platform", 
            new { Platform = platform });
    }

    public async Task<IEnumerable<VideoGame>> GetGamesByGenreAsync(string genre)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Genre = @Genre", 
            new { Genre = genre });
    }

    public async Task<IEnumerable<VideoGame>> GetGamesByYearAsync(int year)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Year = @Year", 
            new { Year = year });
    }

    public async Task<IEnumerable<PlatformSales>> GetPlatformSalesDistributionAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<PlatformSales>(
            @"SELECT 
                Platform,
                SUM(Global_Sales) as GlobalSales,
                SUM(NA_Sales) as NASales,
                SUM(EU_Sales) as EUSales,
                SUM(JP_Sales) as JPSales,
                SUM(Other_Sales) as OtherSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            GROUP BY Platform
            ORDER BY SUM(Global_Sales) DESC");
    }

    public async Task<IEnumerable<YearSales>> GetTimelineDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<YearSales>(
            @"SELECT 
                Year,
                SUM(Global_Sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE Year IS NOT NULL AND Year >= 1980
            GROUP BY Year
            ORDER BY Year");
    }

    public async Task<IEnumerable<GenreSales>> GetGenreDistributionAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<GenreSales>(
            @"SELECT 
                Genre,
                SUM(Global_Sales) as TotalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            GROUP BY Genre
            ORDER BY SUM(Global_Sales) DESC");
    }

    public async Task<IEnumerable<PlatformSales>> GetPlatformDataAsync(string platform)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<PlatformSales>(
            @"SELECT 
                Platform,
                SUM(Global_Sales) as GlobalSales,
                SUM(NA_Sales) as NASales,
                SUM(EU_Sales) as EUSales,
                SUM(JP_Sales) as JPSales,
                SUM(Other_Sales) as OtherSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE Platform = @Platform
            GROUP BY Platform", 
            new { Platform = platform });
    }

    public async Task<IEnumerable<GenreSales>> GetGenreDataAsync(string genre)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<GenreSales>(
            @"SELECT 
                Genre,
                SUM(Global_Sales) as TotalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE Genre = @Genre
            GROUP BY Genre", 
            new { Genre = genre });
    }

    public async Task<IEnumerable<YearSales>> GetYearDataAsync(int year)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<YearSales>(
            @"SELECT 
                Year,
                SUM(Global_Sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE Year = @Year
            GROUP BY Year", 
            new { Year = year });
    }

    public async Task<IEnumerable<PlatformSales>> GetPlatformSalesDistributionWithFilter(string? platform = null, string? genre = null, int? year = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        var query = @"
            SELECT 
                Platform,
                SUM(Global_Sales) as GlobalSales,
                SUM(NA_Sales) as NASales,
                SUM(EU_Sales) as EUSales,
                SUM(JP_Sales) as JPSales,
                SUM(Other_Sales) as OtherSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE 1=1";

        var parameters = new DynamicParameters();
        if (!string.IsNullOrEmpty(platform))
        {
            query += " AND Platform = @Platform";
            parameters.Add("Platform", platform);
        }
        if (!string.IsNullOrEmpty(genre))
        {
            query += " AND Genre = @Genre";
            parameters.Add("Genre", genre);
        }
        if (year.HasValue)
        {
            query += " AND Year = @Year";
            parameters.Add("Year", year);
        }

        query += " GROUP BY Platform ORDER BY SUM(Global_Sales) DESC";
        
        return await connection.QueryAsync<PlatformSales>(query, parameters);
    }

    public async Task<IEnumerable<GenreSales>> GetGenreDistributionWithFilter(string? platform = null, string? genre = null, int? year = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        var query = @"
            SELECT 
                Genre,
                SUM(Global_Sales) as TotalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE 1=1";

        var parameters = new DynamicParameters();
        if (!string.IsNullOrEmpty(platform))
        {
            query += " AND Platform = @Platform";
            parameters.Add("Platform", platform);
        }
        if (!string.IsNullOrEmpty(genre))
        {
            query += " AND Genre = @Genre";
            parameters.Add("Genre", genre);
        }
        if (year.HasValue)
        {
            query += " AND Year = @Year";
            parameters.Add("Year", year);
        }

        query += " GROUP BY Genre ORDER BY SUM(Global_Sales) DESC";
        
        return await connection.QueryAsync<GenreSales>(query, parameters);
    }

    public async Task<IEnumerable<YearSales>> GetTimelineDataWithFilter(string? platform = null, string? genre = null, int? year = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        var query = @"
            SELECT 
                Year,
                SUM(Global_Sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM video_games_sales
            WHERE Year IS NOT NULL AND Year >= 1980";

        var parameters = new DynamicParameters();
        if (!string.IsNullOrEmpty(platform))
        {
            query += " AND Platform = @Platform";
            parameters.Add("Platform", platform);
        }
        if (!string.IsNullOrEmpty(genre))
        {
            query += " AND Genre = @Genre";
            parameters.Add("Genre", genre);
        }
        if (year.HasValue)
        {
            query += " AND Year = @Year";
            parameters.Add("Year", year);
        }

        query += " GROUP BY Year ORDER BY Year";
        
        return await connection.QueryAsync<YearSales>(query, parameters);
    }

    public async Task<IEnumerable<VideoGame>> GetFilteredGamesAsync(string? platform = null, string? genre = null, int? year = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        var query = "SELECT * FROM video_games_sales WHERE 1=1";

        var parameters = new DynamicParameters();
        if (!string.IsNullOrEmpty(platform))
        {
            query += " AND Platform = @Platform";
            parameters.Add("Platform", platform);
        }
        if (!string.IsNullOrEmpty(genre))
        {
            query += " AND Genre = @Genre";
            parameters.Add("Genre", genre);
        }
        if (year.HasValue)
        {
            query += " AND Year = @Year";
            parameters.Add("Year", year);
        }

        query += " ORDER BY Global_Sales DESC";
        
        return await connection.QueryAsync<VideoGame>(query, parameters);
    }
}