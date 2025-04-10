using Dapper;
using MySql.Data.MySqlClient;
using back.Models;

namespace back.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<IEnumerable<VideoGame>> GetAllGamesAsync(int limit = 100, int offset = 0)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales LIMIT @Limit OFFSET @Offset", 
            new { Limit = limit, Offset = offset });
    }

    public async Task<VideoGame?> GetGameByIdAsync(int rank)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Rank = @Rank", 
            new { Rank = rank });
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

    public async Task<IEnumerable<VideoGame>> GetGamesByPublisherAsync(string publisher)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Publisher = @Publisher", 
            new { Publisher = publisher });
    }

    public async Task<IEnumerable<VideoGame>> GetGamesByYearAsync(int year)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Year = @Year", 
            new { Year = year });
    }

    public async Task<IEnumerable<string>> GetAllPlatformsAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT Platform FROM video_games_sales ORDER BY Platform");
    }

    public async Task<IEnumerable<string>> GetAllGenresAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT Genre FROM video_games_sales ORDER BY Genre");
    }

    public async Task<IEnumerable<string>> GetAllPublishersAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT Publisher FROM video_games_sales ORDER BY Publisher");
    }
    
    public async Task<IEnumerable<int>> GetAllYearsAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<int>(
            "SELECT DISTINCT Year FROM video_games_sales WHERE Year IS NOT NULL ORDER BY Year");
    }

    public async Task<IEnumerable<VideoGame>> GetTopSellingGamesAsync(int limit = 10)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales ORDER BY Global_Sales DESC LIMIT @Limit", 
            new { Limit = limit });
    }

    public async Task<IEnumerable<VideoGame>> SearchGamesAsync(string searchTerm)
    {
        using var connection = new MySqlConnection(_connectionString);
        var term = $"%{searchTerm}%";
        return await connection.QueryAsync<VideoGame>(
            "SELECT * FROM video_games_sales WHERE Name LIKE @Term OR Publisher LIKE @Term LIMIT 100", 
            new { Term = term });
    }
}