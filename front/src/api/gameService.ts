import axios from "axios";

const API_BASE_URL = "http://localhost:5053/api";

export interface VGStatsData {
  totalGames: number;
  totalConsoles: number;
  totalGenres: number;
  totalPublishers: number;
  totalDevelopers: number;
  totalSales: number;
  averageSales: number;
  maxSales: number;
  minSales: number;
  averageCriticScore: number;
}

export interface GameData {
  img: string;
  title: string;
  console: string;
  genre: string;
  publisher: string;
  developer: string;
  criticScore: number;
  totalSales: number;
  naSales: number;
  jpSales: number;
  palSales: number;
  otherSales: number;
  releaseDate: string;
  lastUpdate: string;
}

export interface PlatformSales {
  platform: string;
  globalSales: number;
  naSales: number;
  palSales: number;
  jpSales: number;
  otherSales: number;
  gameCount: number;
}

export interface YearSales {
  year: number;
  globalSales: number;
  gameCount: number;
}

export interface GenreSales {
  genre: string;
  totalSales: number;
  gameCount: number;
}

export interface FilteredData {
  platformSales: PlatformSales[];
  genreData: GenreSales[];
  timelineData: YearSales[];
}

export interface TimelineGrowthData {
  Year: number;
  GameCount: number;
  GlobalSales: number;
  GameCountGrowth: number;
  SalesGrowth: number;
  IsPeak: number;
  IsValley: number;
  IsSignificantChange: number;
  ChangeDirection: string;
}

export interface SalesPerGameData {
  year: number;
  globalSales: number;
  gameCount: number;
  salesPerGame: number;
}

export interface ConsoleEfficiencyData {
  platform: string;
  globalSales: number;
  naSales: number;
  palSales: number;
  jpSales: number;
  otherSales: number;
  gameCount: number;
  salesPerGame: number;
}

export interface ConsoleTopGenre {
  genre: string;
  count: number;
  sales: number;
}

export interface ConsoleGroupData {
  groupName: string;
  platform: string;
  globalSales: number;
  gameCount: number;
}

export const gameService = {
  getStats: () =>
    axios.get<VGStatsData>(`${API_BASE_URL}/stats`).then((res) => res.data),

  getTopGames: (limit: number) =>
    axios
      .get<GameData[]>(`${API_BASE_URL}/games/top/${limit}`)
      .then((res) => res.data),

  getGamesByConsole: (console: string) =>
    axios
      .get<GameData[]>(`${API_BASE_URL}/games/console/${console}`)
      .then((res) => res.data),

  getGamesByGenre: (genre: string) =>
    axios
      .get<GameData[]>(`${API_BASE_URL}/games/genre/${genre}`)
      .then((res) => res.data),

  getGamesByYear: (year: number) =>
    axios
      .get<GameData[]>(`${API_BASE_URL}/games/year/${year}`)
      .then((res) => res.data),

  getConsoles: () =>
    axios.get<string[]>(`${API_BASE_URL}/consoles`).then((res) => res.data),

  getGenres: () =>
    axios.get<string[]>(`${API_BASE_URL}/genres`).then((res) => res.data),

  getYears: () =>
    axios.get<number[]>(`${API_BASE_URL}/years`).then((res) => res.data),

  getDevelopers: () =>
    axios.get<string[]>(`${API_BASE_URL}/developers`).then((res) => res.data),

  getPublishers: () =>
    axios.get<string[]>(`${API_BASE_URL}/publishers`).then((res) => res.data),

  getConsoleSalesDistribution: () =>
    axios
      .get<PlatformSales[]>(`${API_BASE_URL}/stats/console-sales`)
      .then((res) => res.data),

  getTimelineData: () =>
    axios
      .get<YearSales[]>(`${API_BASE_URL}/stats/timeline`)
      .then((res) => res.data),

  getTimelineGrowthData: () =>
    axios
      .get<TimelineGrowthData[]>(`${API_BASE_URL}/stats/timeline-growth`)
      .then((res) => res.data),

  getSalesPerGameData: () =>
    axios
      .get<SalesPerGameData[]>(`${API_BASE_URL}/stats/sales-per-game`)
      .then((res) => res.data),

  getGenreDistribution: () =>
    axios
      .get<GenreSales[]>(`${API_BASE_URL}/stats/genre-distribution`)
      .then((res) => res.data),

  getConsoleData: (console: string) =>
    axios
      .get<PlatformSales[]>(`${API_BASE_URL}/console/${console}`)
      .then((res) => res.data),

  getGenreData: (genre: string) =>
    axios
      .get<GenreSales[]>(`${API_BASE_URL}/genre/${genre}`)
      .then((res) => res.data),

  getYearData: (year: number) =>
    axios
      .get<YearSales[]>(`${API_BASE_URL}/year/${year}`)
      .then((res) => res.data),

  getFilteredData: (filters: {
    console?: string;
    genre?: string;
    year?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.console) params.append("console", filters.console);
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.year) params.append("year", filters.year.toString());

    return axios
      .get<FilteredData>(`${API_BASE_URL}/filtered-data?${params.toString()}`)
      .then((res) => res.data);
  },

  getFilteredGames: (filters: {
    console?: string;
    genre?: string;
    year?: number;
    publisher?: string;
    developer?: string;
    minCriticScore?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.console) params.append("console", filters.console);
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.year) params.append("year", filters.year.toString());
    if (filters.publisher) params.append("publisher", filters.publisher);
    if (filters.developer) params.append("developer", filters.developer);
    if (filters.minCriticScore)
      params.append("minCriticScore", filters.minCriticScore.toString());

    return axios
      .get<GameData[]>(`${API_BASE_URL}/games/filtered?${params.toString()}`)
      .then((res) => res.data);
  },

  getConsoleSalesEfficiency: () =>
    axios
      .get<ConsoleEfficiencyData[]>(`${API_BASE_URL}/stats/console-efficiency`)
      .then((res) => res.data),

  getConsoleTopGenres: (console: string) =>
    axios
      .get<ConsoleTopGenre[]>(`${API_BASE_URL}/console/${console}/top-genres`)
      .then((res) => res.data),

  getConsoleGroups: () =>
    axios
      .get<ConsoleGroupData[]>(`${API_BASE_URL}/stats/console-groups`)
      .then((res) => res.data),
};
