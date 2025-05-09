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

    public async Task<IEnumerable<VGChartz2024>> GetTopGamesAsync(int limit = 10)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VGChartz2024>(
            @"SELECT 
                img, 
                title, 
                console, 
                genre, 
                publisher, 
                developer, 
                critic_score AS CriticScore, 
                total_sales AS TotalSales, 
                na_sales AS NASales, 
                jp_sales AS JPSales, 
                pal_sales AS PALSales, 
                other_sales AS OtherSales, 
                release_date AS ReleaseDate, 
                last_update AS LastUpdate 
            FROM vgchartz_2024 
            ORDER BY total_sales DESC 
            LIMIT @Limit", 
            new { Limit = limit });
    }

    public async Task<IEnumerable<VGChartz2024>> GetGamesByConsoleAsync(string console)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VGChartz2024>(
            @"SELECT 
                img, 
                title, 
                console, 
                genre, 
                publisher, 
                developer, 
                critic_score AS CriticScore, 
                total_sales AS TotalSales, 
                na_sales AS NASales, 
                jp_sales AS JPSales, 
                pal_sales AS PALSales, 
                other_sales AS OtherSales, 
                release_date AS ReleaseDate, 
                last_update AS LastUpdate 
            FROM vgchartz_2024 
            WHERE console = @Console", 
            new { Console = console });
    }

    public async Task<IEnumerable<VGChartz2024>> GetGamesByGenreAsync(string genre)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VGChartz2024>(
            @"SELECT 
                img, 
                title, 
                console, 
                genre, 
                publisher, 
                developer, 
                critic_score AS CriticScore, 
                total_sales AS TotalSales, 
                na_sales AS NASales, 
                jp_sales AS JPSales, 
                pal_sales AS PALSales, 
                other_sales AS OtherSales, 
                release_date AS ReleaseDate, 
                last_update AS LastUpdate 
            FROM vgchartz_2024 
            WHERE genre = @Genre", 
            new { Genre = genre });
    }

    public async Task<IEnumerable<VGChartz2024>> GetGamesByYearAsync(int year)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<VGChartz2024>(
            @"SELECT 
                img, 
                title, 
                console, 
                genre, 
                publisher, 
                developer, 
                critic_score AS CriticScore, 
                total_sales AS TotalSales, 
                na_sales AS NASales, 
                jp_sales AS JPSales, 
                pal_sales AS PALSales, 
                other_sales AS OtherSales, 
                release_date AS ReleaseDate, 
                last_update AS LastUpdate 
            FROM vgchartz_2024 
            WHERE YEAR(release_date) = @Year", 
            new { Year = year });
    }
    
    public async Task<IEnumerable<string>> GetConsolesAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT console FROM vgchartz_2024 ORDER BY console");
    }
    
    public async Task<IEnumerable<string>> GetGenresAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT genre FROM vgchartz_2024 ORDER BY genre");
    }
    
    public async Task<IEnumerable<int>> GetYearsAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<int>(
            "SELECT DISTINCT YEAR(release_date) FROM vgchartz_2024 WHERE release_date IS NOT NULL ORDER BY YEAR(release_date)");
    }
    
    public async Task<IEnumerable<string>> GetDevelopersAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT developer FROM vgchartz_2024 ORDER BY developer");
    }
    
    public async Task<IEnumerable<string>> GetPublishersAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<string>(
            "SELECT DISTINCT publisher FROM vgchartz_2024 ORDER BY publisher");
    }

    public async Task<IEnumerable<PlatformSales>> GetConsoleSalesDistributionAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<PlatformSales>(
            @"SELECT 
                console as Platform,
                SUM(total_sales) as GlobalSales,
                SUM(na_sales) as NASales,
                SUM(pal_sales) as PALSales,
                SUM(jp_sales) as JPSales,
                SUM(other_sales) as OtherSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            GROUP BY console
            ORDER BY SUM(total_sales) DESC");
    }

    public async Task<IEnumerable<YearSales>> GetTimelineDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<YearSales>(
            @"SELECT 
                YEAR(release_date) as Year,
                SUM(total_sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE release_date IS NOT NULL
            GROUP BY YEAR(release_date)
            ORDER BY YEAR(release_date)");
    }

    public async Task<IEnumerable<GenreSales>> GetGenreDistributionAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<GenreSales>(
            @"SELECT 
                genre as Genre,
                SUM(total_sales) as TotalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            GROUP BY genre
            ORDER BY SUM(total_sales) DESC");
    }
    
    public async Task<IEnumerable<PlatformSales>> GetConsoleDataAsync(string console)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<PlatformSales>(
            @"SELECT 
                console as Platform,
                SUM(total_sales) as GlobalSales,
                SUM(na_sales) as NASales,
                SUM(pal_sales) as PALSales,
                SUM(jp_sales) as JPSales,
                SUM(other_sales) as OtherSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE console = @Console
            GROUP BY console", 
            new { Console = console });
    }

    public async Task<IEnumerable<GenreSales>> GetGenreDataAsync(string genre)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<GenreSales>(
            @"SELECT 
                genre as Genre,
                SUM(total_sales) as TotalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE genre = @Genre
            GROUP BY genre", 
            new { Genre = genre });
    }

    public async Task<IEnumerable<YearSales>> GetYearDataAsync(int year)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync<YearSales>(
            @"SELECT 
                YEAR(release_date) as Year,
                SUM(total_sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE YEAR(release_date) = @Year
            GROUP BY YEAR(release_date)", 
            new { Year = year });
    }

    public async Task<VGStatsData> GetStatsDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        
        var sql = @"
            SELECT 
                COUNT(*) as TotalGames,
                COUNT(DISTINCT console) as TotalConsoles,
                COUNT(DISTINCT genre) as TotalGenres,
                COUNT(DISTINCT publisher) as TotalPublishers,
                COUNT(DISTINCT developer) as TotalDevelopers,
                SUM(total_sales) as TotalSales,
                AVG(total_sales) as AverageSales,
                MAX(total_sales) as MaxSales,
                MIN(total_sales) as MinSales,
                AVG(critic_score) as AverageCriticScore
            FROM vgchartz_2024";
            
        return await connection.QueryFirstOrDefaultAsync<VGStatsData>(sql) ?? new VGStatsData();
    }

    public async Task<IEnumerable<VGChartz2024>> GetFilteredGamesAsync(
        string? console = null, 
        string? genre = null, 
        int? year = null, 
        string? publisher = null,
        string? developer = null,
        decimal? minCriticScore = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        var query = @"SELECT 
                img, 
                title, 
                console, 
                genre, 
                publisher, 
                developer, 
                critic_score AS CriticScore, 
                total_sales AS TotalSales, 
                na_sales AS NASales, 
                jp_sales AS JPSales, 
                pal_sales AS PALSales, 
                other_sales AS OtherSales, 
                release_date AS ReleaseDate, 
                last_update AS LastUpdate 
            FROM vgchartz_2024 
            WHERE 1=1";

        var parameters = new DynamicParameters();
        
        if (!string.IsNullOrEmpty(console))
        {
            query += " AND console = @Console";
            parameters.Add("Console", console);
        }
        
        if (!string.IsNullOrEmpty(genre))
        {
            query += " AND genre = @Genre";
            parameters.Add("Genre", genre);
        }
        
        if (year.HasValue)
        {
            query += " AND YEAR(release_date) = @Year";
            parameters.Add("Year", year);
        }
        
        if (!string.IsNullOrEmpty(publisher))
        {
            query += " AND publisher = @Publisher";
            parameters.Add("Publisher", publisher);
        }
        
        if (!string.IsNullOrEmpty(developer))
        {
            query += " AND developer = @Developer";
            parameters.Add("Developer", developer);
        }
        
        if (minCriticScore.HasValue)
        {
            query += " AND critic_score >= @MinCriticScore";
            parameters.Add("MinCriticScore", minCriticScore);
        }

        query += " ORDER BY total_sales DESC";
        
        return await connection.QueryAsync<VGChartz2024>(query, parameters);
    }

    public async Task<FilteredData> GetFilteredDataAsync(
        string? console = null, 
        string? genre = null, 
        int? year = null)
    {
        using var connection = new MySqlConnection(_connectionString);
        
        // Platform Sales Query
        var platformQuery = @"
            SELECT 
                console as Platform,
                SUM(total_sales) as GlobalSales,
                SUM(na_sales) as NASales,
                SUM(pal_sales) as PALSales,
                SUM(jp_sales) as JPSales,
                SUM(other_sales) as OtherSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE 1=1";

        // Genre Data Query
        var genreQuery = @"
            SELECT 
                genre as Genre,
                SUM(total_sales) as TotalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE 1=1";

        // Timeline Data Query
        var timelineQuery = @"
            SELECT 
                YEAR(release_date) as Year,
                SUM(total_sales) as GlobalSales,
                COUNT(*) as GameCount
            FROM vgchartz_2024
            WHERE release_date IS NOT NULL";

        var parameters = new DynamicParameters();
        
        if (!string.IsNullOrEmpty(console))
        {
            platformQuery += " AND console = @Console";
            genreQuery += " AND console = @Console";
            timelineQuery += " AND console = @Console";
            parameters.Add("Console", console);
        }
        
        if (!string.IsNullOrEmpty(genre))
        {
            platformQuery += " AND genre = @Genre";
            genreQuery += " AND genre = @Genre";
            timelineQuery += " AND genre = @Genre";
            parameters.Add("Genre", genre);
        }
        
        if (year.HasValue)
        {
            platformQuery += " AND YEAR(release_date) = @Year";
            genreQuery += " AND YEAR(release_date) = @Year";
            timelineQuery += " AND YEAR(release_date) = @Year";
            parameters.Add("Year", year);
        }

        platformQuery += " GROUP BY console ORDER BY SUM(total_sales) DESC";
        genreQuery += " GROUP BY genre ORDER BY SUM(total_sales) DESC";
        timelineQuery += " GROUP BY YEAR(release_date) ORDER BY YEAR(release_date)";
        
        // Execute all queries
        var platformSales = await connection.QueryAsync<PlatformSales>(platformQuery, parameters);
        var genreData = await connection.QueryAsync<GenreSales>(genreQuery, parameters);
        var timelineData = await connection.QueryAsync<YearSales>(timelineQuery, parameters);

        // Return combined results
        return new FilteredData
        {
            PlatformSales = platformSales,
            GenreData = genreData,
            TimelineData = timelineData
        };
    }

    public async Task<IEnumerable<object>> GetTimelineGrowthDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync(
            @"WITH YearData AS (
                SELECT 
                    YEAR(release_date) as year,
                    SUM(total_sales) as globalSales,
                    COUNT(*) as gameCount
                FROM vgchartz_2024
                WHERE release_date IS NOT NULL
                GROUP BY YEAR(release_date)
            ),
            ConsecutiveYears AS (
                SELECT 
                    current.year AS Year,
                    current.gameCount AS GameCount,
                    current.globalSales AS GlobalSales,
                    prev.gameCount AS PrevGameCount,
                    prev.globalSales AS PrevGlobalSales,
                    prev1.gameCount AS Prev1GameCount,
                    prev2.gameCount AS Prev2GameCount,
                    next1.gameCount AS Next1GameCount,
                    next2.gameCount AS Next2GameCount
                FROM YearData current
                LEFT JOIN YearData prev ON current.year = prev.year + 1
                LEFT JOIN YearData prev1 ON current.year = prev1.year + 1
                LEFT JOIN YearData prev2 ON current.year = prev2.year + 2
                LEFT JOIN YearData next1 ON current.year = next1.year - 1
                LEFT JOIN YearData next2 ON current.year = next2.year - 2
            )
            SELECT 
                Year,
                GameCount,
                GlobalSales,
                CASE 
                    WHEN PrevGameCount IS NULL OR PrevGameCount = 0 THEN 0 
                    ELSE ROUND((GameCount - PrevGameCount) / PrevGameCount * 100, 2) 
                END AS GameCountGrowth,
                CASE 
                    WHEN PrevGlobalSales IS NULL OR PrevGlobalSales = 0 THEN 0 
                    ELSE ROUND((GlobalSales - PrevGlobalSales) / PrevGlobalSales * 100, 2) 
                END AS SalesGrowth,
                CASE WHEN 
                    GameCount > Prev1GameCount AND
                    GameCount > Prev2GameCount AND
                    GameCount > Next1GameCount AND
                    GameCount > Next2GameCount AND
                    Prev1GameCount IS NOT NULL AND
                    Prev2GameCount IS NOT NULL AND
                    Next1GameCount IS NOT NULL AND
                    Next2GameCount IS NOT NULL
                THEN true ELSE false END AS IsPeak,
                CASE WHEN 
                    GameCount < Prev1GameCount AND
                    GameCount < Prev2GameCount AND
                    GameCount < Next1GameCount AND
                    GameCount < Next2GameCount AND
                    Prev1GameCount IS NOT NULL AND
                    Prev2GameCount IS NOT NULL AND
                    Next1GameCount IS NOT NULL AND
                    Next2GameCount IS NOT NULL
                THEN true ELSE false END AS IsValley,
                CASE WHEN 
                    PrevGameCount IS NOT NULL AND PrevGameCount > 0 AND
                    ABS((GameCount - PrevGameCount) / PrevGameCount * 100) > 30
                THEN true ELSE false END AS IsSignificantChange,
                CASE WHEN 
                    PrevGameCount IS NULL OR PrevGameCount = 0 THEN 'stable'
                    WHEN (GameCount - PrevGameCount) / PrevGameCount * 100 > 0
                    THEN 'growth' ELSE 'decline' END AS ChangeDirection
            FROM ConsecutiveYears
            ORDER BY Year");
    }

    public async Task<IEnumerable<object>> GetSalesPerGameByYearAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync(
            @"SELECT 
                YEAR(release_date) as year,
                SUM(total_sales) as globalSales,
                COUNT(*) as gameCount,
                ROUND(SUM(total_sales) / COUNT(*), 2) as salesPerGame
            FROM vgchartz_2024
            WHERE release_date IS NOT NULL
            GROUP BY YEAR(release_date)
            ORDER BY YEAR(release_date)");
    }

    public async Task<IEnumerable<object>> GetConsoleSalesEfficiencyDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync(
            @"SELECT 
                console as platform,
                SUM(total_sales) as globalSales,
                SUM(na_sales) as naSales,
                SUM(pal_sales) as palSales,
                SUM(jp_sales) as jpSales,
                SUM(other_sales) as otherSales,
                COUNT(*) as gameCount,
                ROUND(SUM(total_sales) / COUNT(*), 2) as salesPerGame
            FROM vgchartz_2024
            GROUP BY console
            ORDER BY salesPerGame DESC");
    }

    public async Task<IEnumerable<object>> GetConsoleTopGenresAsync(string console)
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync(
            @"SELECT 
                genre,
                COUNT(*) as count,
                SUM(total_sales) as sales
            FROM vgchartz_2024
            WHERE console = @Console
            GROUP BY genre
            ORDER BY count DESC
            LIMIT 10", 
            new { Console = console });
    }

    public async Task<IEnumerable<object>> GetConsoleGroupsDataAsync()
    {
        using var connection = new MySqlConnection(_connectionString);
        return await connection.QueryAsync(
            @"SELECT 
                CASE
                    WHEN console IN ('NES', 'SNES', 'N64', 'GC', 'Wii', 'Wii U', 'Switch', 'GB', 'GBA', 'DS', '3DS', 'Virtual Boy') THEN 'Nintendo'
                    WHEN console IN ('PS', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PSV') THEN 'PlayStation'
                    WHEN console IN ('XB', 'X360', 'XOne', 'XS') THEN 'Xbox'
                    WHEN console IN ('GEN', 'SCD', '32X', 'SAT', 'DC', 'GG', 'PICO') THEN 'Sega'
                    WHEN console = 'PC' THEN 'PC'
                    WHEN console IN ('Mobile', 'iOS', 'Android') THEN 'Mobile'
                    ELSE 'Other'
                END as groupName,
                console as platform,
                SUM(total_sales) as globalSales,
                COUNT(*) as gameCount
            FROM vgchartz_2024
            GROUP BY console
            ORDER BY console");
    }
}