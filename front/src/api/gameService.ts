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
  na_Sales: number;
  eu_Sales: number;
  jp_Sales: number;
  other_Sales: number;
  global_Sales: number;
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
};
