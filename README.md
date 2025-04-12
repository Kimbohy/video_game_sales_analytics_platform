# Video Game Sales Analytics Platform

A full-stack web application for analyzing and visualizing video game sales data across different platforms, genres, and regions.

Data source: [Video Games Sales dataset on Kaggle](https://www.kaggle.com/datasets/zahidmughal2343/video-games-sale)

## Features

- 📊 Interactive data visualization of video game sales
- 🎮 Filter games by platform, genre, and release year
- 📈 Sales analysis across different regions (NA, EU, JP, Other)
- 📊 Comprehensive statistics including:
  - Platform sales distribution
  - Genre-wise market analysis
  - Year-over-year sales trends
  - Publisher performance metrics

## Tech Stack

### Backend (.NET)

- .NET 9.0
- MySQL Database
- Dapper for ORM
- Swagger/OpenAPI for API documentation

### Frontend (React)

- TypeScript
- Vite
- Tailwind CSS
- Axios for API communication
- React Charts for data visualization

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- Node.js (LTS version recommended)
- MySQL Server
- pnpm package manager

### Database Setup

1. Ensure MySQL Server is running
2. Change the import.sql file to match the path of your csv file
3. Import the video games sales data:

```bash
mysql -u your_username -p your_database < import.sql
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd back
```

2. Update the connection string in `appsettings.json` with your MySQL credentials

3. Run the backend:

```bash
dotnet run
```

The API will be available at `http://localhost:5053`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd front
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Games

- `GET /api/games/top/{limit}` - Get top selling games
- `GET /api/games/platform/{platform}` - Get games by platform
- `GET /api/games/genre/{genre}` - Get games by genre
- `GET /api/games/year/{year}` - Get games by release year
- `GET /api/games/filtered` - Get games with multiple filters

### Statistics

- `GET /api/stats/platform-sales` - Get platform sales distribution
- `GET /api/stats/timeline` - Get sales timeline data
- `GET /api/stats/genre-distribution` - Get genre-wise sales distribution

## Project Structure

```
├── back/                 # Backend .NET application
│   ├── Models/           # Data models
│   ├── Services/         # Business logic and database services
│   └── Properties/       # Application configuration
├── front/                # Frontend React application
│   ├── src/
│   │   ├── api/         # API service layer
│   │   ├── components/  # React components
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
└── import.sql           # Database import script
```