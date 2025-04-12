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

app.MapGet("/api/games/top/{count}", async (DatabaseService db, int count) =>
{
    return await db.GetTopSellingGamesAsync(count);
})
.WithName("GetTopGames")
.WithOpenApi();

app.MapGet("/api/games/platform/{platform}", async (DatabaseService db, string platform) =>
{
    return await db.GetGamesByPlatformAsync(platform);
})
.WithName("GetGamesByPlatform")
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

app.MapGet("/api/games/filtered", async (DatabaseService db, string? platform, string? genre, int? year) =>
{
    return await db.GetFilteredGamesAsync(platform, genre, year);
})
.WithName("GetFilteredGames")
.WithOpenApi();

// Aggregated data endpoints
app.MapGet("/api/stats/platform-sales", async (DatabaseService db) =>
{
    return await db.GetPlatformSalesDistributionAsync();
})
.WithName("GetPlatformSalesDistribution")
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

// Individual data endpoints
app.MapGet("/api/platform/{platform}", async (DatabaseService db, string platform) =>
{
    return await db.GetPlatformDataAsync(platform);
})
.WithName("GetPlatformData")
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
app.MapGet("/api/filtered-data", async (DatabaseService db, string? platform, string? genre, int? year) =>
{
    var platformSales = await db.GetPlatformSalesDistributionWithFilter(platform, genre, year);
    var genreData = await db.GetGenreDistributionWithFilter(platform, genre, year);
    var timelineData = await db.GetTimelineDataWithFilter(platform, genre, year);

    return new
    {
        platformSales,
        genreData,
        timelineData
    };
})
.WithName("GetFilteredData")
.WithOpenApi();

app.Run();
