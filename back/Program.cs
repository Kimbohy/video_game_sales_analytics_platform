using back.Services;
using MySql.Data.MySqlClient;
using Dapper;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React Vite default port
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Add Database Service
builder.Services.AddScoped<DatabaseService>();

// Add controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Video Games API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

// API endpoints for Video Games
app.MapGet("/api/games", async (DatabaseService db, int? limit, int? offset) =>
{
    return await db.GetAllGamesAsync(limit ?? 100, offset ?? 0);
})
.WithName("GetAllGames")
.WithOpenApi();

app.MapGet("/api/games/{id}", async (DatabaseService db, int id) =>
{
    var game = await db.GetGameByIdAsync(id);
    return game is null ? Results.NotFound() : Results.Ok(game);
})
.WithName("GetGameById")
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

app.MapGet("/api/games/publisher/{publisher}", async (DatabaseService db, string publisher) =>
{
    return await db.GetGamesByPublisherAsync(publisher);
})
.WithName("GetGamesByPublisher")
.WithOpenApi();

app.MapGet("/api/games/year/{year}", async (DatabaseService db, int year) =>
{
    return await db.GetGamesByYearAsync(year);
})
.WithName("GetGamesByYear")
.WithOpenApi();

app.MapGet("/api/platforms", async (DatabaseService db) =>
{
    return await db.GetAllPlatformsAsync();
})
.WithName("GetAllPlatforms")
.WithOpenApi();

app.MapGet("/api/genres", async (DatabaseService db) =>
{
    return await db.GetAllGenresAsync();
})
.WithName("GetAllGenres")
.WithOpenApi();

app.MapGet("/api/publishers", async (DatabaseService db) =>
{
    return await db.GetAllPublishersAsync();
})
.WithName("GetAllPublishers")
.WithOpenApi();

app.MapGet("/api/years", async (DatabaseService db) =>
{
    return await db.GetAllYearsAsync();
})
.WithName("GetAllYears")
.WithOpenApi();

app.MapGet("/api/games/top/{count}", async (DatabaseService db, int count) =>
{
    return await db.GetTopSellingGamesAsync(count);
})
.WithName("GetTopGames")
.WithOpenApi();

app.MapGet("/api/games/search/{term}", async (DatabaseService db, string term) =>
{
    return await db.SearchGamesAsync(term);
})
.WithName("SearchGames")
.WithOpenApi();

// Summary statistics endpoint
app.MapGet("/api/stats", async (DatabaseService db) =>
{
    using var connection = new MySqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    var statsQuery = @"
        SELECT 
            COUNT(*) as TotalGames,
            COUNT(DISTINCT Platform) as TotalPlatforms,
            COUNT(DISTINCT Genre) as TotalGenres,
            COUNT(DISTINCT Publisher) as TotalPublishers,
            SUM(Global_Sales) as TotalSales,
            AVG(Global_Sales) as AverageSales,
            MAX(Global_Sales) as MaxSales,
            MIN(Global_Sales) as MinSales
        FROM video_games_sales";
    
    return await connection.QueryFirstAsync(statsQuery);
})
.WithName("GetStatistics")
.WithOpenApi();

app.Run();
