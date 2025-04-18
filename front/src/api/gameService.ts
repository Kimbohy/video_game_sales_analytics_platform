import axios from "axios";

const API_BASE_URL = "http://localhost:5053/api";

export interface GameStats {
  totalGames: number;
  totalPlatforms: number;
  totalGenres: number;
  totalPublishers: number;
  totalSales: number;
  averageSales: number;
  maxSales: number;
  minSales: number;
}

export interface VideoGame {
  rank: number;
  name: string;
  platform: string;
  year: number;
  genre: string;
  publisher: string;
  nA_Sales: number;
  eU_Sales: number;
  jP_Sales: number;
  other_Sales: number;
  global_Sales: number;
}

export interface PlatformSales {
  platform: string;
  globalSales: number;
  naSales: number;
  euSales: number;
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

export const gameService = {
  getStats: () =>
    axios.get<GameStats>(`${API_BASE_URL}/stats`).then((res) => res.data),
  getTopGames: (limit: number) =>
    axios
      .get<VideoGame[]>(`${API_BASE_URL}/games/top/${limit}`)
      .then((res) => res.data),
  getGamesByPlatform: (platform: string) =>
    axios
      .get<VideoGame[]>(`${API_BASE_URL}/games/platform/${platform}`)
      .then((res) => res.data),
  getGamesByGenre: (genre: string) =>
    axios
      .get<VideoGame[]>(`${API_BASE_URL}/games/genre/${genre}`)
      .then((res) => res.data),
  getGamesByYear: (year: number) =>
    axios
      .get<VideoGame[]>(`${API_BASE_URL}/games/year/${year}`)
      .then((res) => res.data),
  getPlatforms: () =>
    axios.get<string[]>(`${API_BASE_URL}/platforms`).then((res) => res.data),
  getGenres: () =>
    axios.get<string[]>(`${API_BASE_URL}/genres`).then((res) => res.data),
  getYears: () =>
    axios.get<number[]>(`${API_BASE_URL}/years`).then((res) => res.data),
  getPlatformSalesDistribution: () =>
    axios
      .get<PlatformSales[]>(`${API_BASE_URL}/stats/platform-sales`)
      .then((res) => res.data),
  getTimelineData: () =>
    axios
      .get<YearSales[]>(`${API_BASE_URL}/stats/timeline`)
      .then((res) => res.data),
  getGenreDistribution: () =>
    axios
      .get<GenreSales[]>(`${API_BASE_URL}/stats/genre-distribution`)
      .then((res) => res.data),
  getPlatformData: (platform: string) =>
    axios
      .get<PlatformSales[]>(`${API_BASE_URL}/platform/${platform}`)
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
    platform?: string;
    genre?: string;
    year?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.platform) params.append("platform", filters.platform);
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.year) params.append("year", filters.year.toString());

    return axios
      .get<FilteredData>(`${API_BASE_URL}/filtered-data?${params.toString()}`)
      .then((res) => res.data);
  },
  getFilteredGames: (filters: {
    platform?: string;
    genre?: string;
    year?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.platform) params.append("platform", filters.platform);
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.year) params.append("year", filters.year.toString());

    return axios
      .get<VideoGame[]>(`${API_BASE_URL}/games/filtered?${params.toString()}`)
      .then((res) => res.data);
  },
};
