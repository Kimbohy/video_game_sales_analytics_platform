using back.Services;
using DotEnv.Core;

new EnvLoader()
    .SetBasePath(Directory.GetCurrentDirectory())
    .Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<DatabaseService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Basic data endpoints
app.MapGet("/api/games/top/{count}", async (DatabaseService db, int count) =>
{
    return await db.GetTopGamesAsync(count);
})
.WithName("GetTopGames")
.WithOpenApi();

app.MapGet("/api/games/console/{console}", async (DatabaseService db, string console) =>
{
    return await db.GetGamesByConsoleAsync(console);
})
.WithName("GetGamesByConsole")
.WithOpenApi();

app.MapGet("/api/games/genre/{genre}", async (DatabaseService db, string genre) =>
{
    return await db.GetGamesByGenreAsync(genre);
})
.WithName("GetGamesByGenre")
.WithOpenApi();

app.MapGet("/api/games/year/{year}", async (DatabaseService db, int year) =>
{
    return await db.GetGamesByYearAsync(year);
})
.WithName("GetGamesByYear")
.WithOpenApi();

app.MapGet("/api/games/filtered", async (DatabaseService db, string? console, string? genre, int? year, string? publisher, string? developer, decimal? minCriticScore) =>
{
    return await db.GetFilteredGamesAsync(console, genre, year, publisher, developer, minCriticScore);
})
.WithName("GetFilteredGames")
.WithOpenApi();

// Get options for filters
app.MapGet("/api/consoles", async (DatabaseService db) =>
{
    return await db.GetConsolesAsync();
})
.WithName("GetConsoles")
.WithOpenApi();

app.MapGet("/api/genres", async (DatabaseService db) =>
{
    return await db.GetGenresAsync();
})
.WithName("GetGenres")
.WithOpenApi();

app.MapGet("/api/years", async (DatabaseService db) =>
{
    return await db.GetYearsAsync();
})
.WithName("GetYears")
.WithOpenApi();

app.MapGet("/api/developers", async (DatabaseService db) =>
{
    return await db.GetDevelopersAsync();
})
.WithName("GetDevelopers")
.WithOpenApi();

app.MapGet("/api/publishers", async (DatabaseService db) =>
{
    return await db.GetPublishersAsync();
})
.WithName("GetPublishers")
.WithOpenApi();

// General statistics
app.MapGet("/api/stats", async (DatabaseService db) =>
{
    return await db.GetStatsDataAsync();
})
.WithName("GetStats")
.WithOpenApi();

// Aggregated data endpoints
app.MapGet("/api/stats/console-sales", async (DatabaseService db) =>
{
    return await db.GetConsoleSalesDistributionAsync();
})
.WithName("GetConsoleSalesDistribution")
.WithOpenApi();

app.MapGet("/api/stats/timeline", async (DatabaseService db) =>
{
    return await db.GetTimelineDataAsync();
})
.WithName("GetTimelineData")
.WithOpenApi();

app.MapGet("/api/stats/genre-distribution", async (DatabaseService db) =>
{
    return await db.GetGenreDistributionAsync();
})
.WithName("GetGenreDistribution")
.WithOpenApi();

app.MapGet("/api/stats/timeline-growth", async (DatabaseService db) =>
{
    return await db.GetTimelineGrowthDataAsync();
})
.WithName("GetTimelineGrowthData")
.WithOpenApi();

app.MapGet("/api/stats/sales-per-game", async (DatabaseService db) =>
{
    return await db.GetSalesPerGameByYearAsync();
})
.WithName("GetSalesPerGameByYear")
.WithOpenApi();

// Individual data endpoints
app.MapGet("/api/console/{console}", async (DatabaseService db, string console) =>
{
    return await db.GetConsoleDataAsync(console);
})
.WithName("GetConsoleData")
.WithOpenApi();

app.MapGet("/api/genre/{genre}", async (DatabaseService db, string genre) =>
{
    return await db.GetGenreDataAsync(genre);
})
.WithName("GetGenreData")
.WithOpenApi();

app.MapGet("/api/year/{year}", async (DatabaseService db, int year) =>
{
    return await db.GetYearDataAsync(year);
})
.WithName("GetYearData")
.WithOpenApi();

// Filtered data endpoints
app.MapGet("/api/filtered-data", async (DatabaseService db, string? console, string? genre, int? year) =>
{
    return await db.GetFilteredDataAsync(console, genre, year);
})
.WithName("GetFilteredData")
.WithOpenApi();

app.Run();
