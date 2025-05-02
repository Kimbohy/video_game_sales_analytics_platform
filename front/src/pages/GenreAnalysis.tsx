import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService, GenreSales } from "../api/gameService";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const GenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedGenres, setComparedGenres] = useState<string[]>([]);

  // Fetch genre distribution data
  const { data: genreData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["genreDistributionData"],
    queryFn: () => gameService.getGenreDistribution(),
  });

  // Fetch data for a specific genre when selected
  const { data: genreGames, isLoading: isLoadingGenreGames } = useQuery({
    queryKey: ["genreGames", selectedGenre],
    queryFn: () => gameService.getGamesByGenre(selectedGenre!),
    enabled: !!selectedGenre,
  });

  // Colors for the charts
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  // Get top consoles for the selected genre
  const getTopConsoles = () => {
    if (!genreGames) return [];

    const consoleCounts: { [key: string]: { count: number; sales: number } } =
      {};

    genreGames.forEach((game) => {
      if (!consoleCounts[game.console]) {
        consoleCounts[game.console] = { count: 0, sales: 0 };
      }
      consoleCounts[game.console].count++;
      consoleCounts[game.console].sales += game.totalSales;
    });

    return Object.entries(consoleCounts)
      .map(([console, data]) => ({
        console,
        count: data.count,
        sales: data.sales,
      }))
      .sort((a, b) => b.sales - a.sales);
  };

  // Get average critic score for selected genre
  const getAverageCriticScore = () => {
    if (!genreGames || genreGames.length === 0) return 0;

    const gamesWithScores = genreGames.filter(
      (game) =>
        game.criticScore !== null &&
        game.criticScore !== undefined &&
        game.criticScore > 0
    );

    if (gamesWithScores.length === 0) return 0;

    const totalScore = gamesWithScores.reduce(
      (sum, game) => sum + (game.criticScore || 0),
      0
    );
    return totalScore / gamesWithScores.length;
  };

  // Get top publishers for selected genre
  const getTopPublishers = () => {
    if (!genreGames) return [];

    const publisherCounts: { [key: string]: { count: number; sales: number } } =
      {};

    genreGames.forEach((game) => {
      if (!publisherCounts[game.publisher]) {
        publisherCounts[game.publisher] = { count: 0, sales: 0 };
      }
      publisherCounts[game.publisher].count++;
      publisherCounts[game.publisher].sales += game.totalSales;
    });

    return Object.entries(publisherCounts)
      .map(([publisher, data]) => ({
        publisher,
        count: data.count,
        sales: data.sales,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Handle adding/removing genres for comparison
  const toggleCompareGenre = (genre: string) => {
    if (comparedGenres.includes(genre)) {
      setComparedGenres(comparedGenres.filter((g) => g !== genre));
    } else {
      if (comparedGenres.length < 5) {
        // Limit to 5 genres for comparison
        setComparedGenres([...comparedGenres, genre]);
      }
    }
  };

  // Calculate regional sales distribution
  const getGenreRegionalData = (genre: string) => {
    const genreItem = genreData?.find((g) => g.genre === genre);
    if (!genreItem) return null;

    // Get games for this genre
    const genreGamesPromise = gameService.getGamesByGenre(genre);

    return genreGamesPromise.then((games) => {
      const naSales = games.reduce((sum, game) => sum + game.naSales, 0);
      const palSales = games.reduce((sum, game) => sum + game.palSales, 0);
      const jpSales = games.reduce((sum, game) => sum + game.jpSales, 0);
      const otherSales = games.reduce((sum, game) => sum + game.otherSales, 0);

      return {
        genre,
        naSales,
        palSales,
        jpSales,
        otherSales,
        totalSales: naSales + palSales + jpSales + otherSales,
        gameCount: games.length,
      };
    });
  };

  // Get genre comparison data
  const getGenreComparisonData = async () => {
    if (!comparedGenres.length) return [];

    const comparisonData = [];

    for (const genre of comparedGenres) {
      const genreItem = genreData?.find((g) => g.genre === genre);
      if (genreItem) {
        const games = await gameService.getGamesByGenre(genre);

        // Calculate regional sales percentages
        const naSales = games.reduce((sum, game) => sum + game.naSales, 0);
        const palSales = games.reduce((sum, game) => sum + game.palSales, 0);
        const jpSales = games.reduce((sum, game) => sum + game.jpSales, 0);
        const otherSales = games.reduce(
          (sum, game) => sum + game.otherSales,
          0
        );

        // Calculate average score
        const gamesWithScores = games.filter(
          (game) =>
            game.criticScore !== null &&
            game.criticScore !== undefined &&
            game.criticScore > 0
        );
        const avgScore =
          gamesWithScores.length > 0
            ? gamesWithScores.reduce(
                (sum, game) => sum + (game.criticScore || 0),
                0
              ) / gamesWithScores.length
            : 0;

        comparisonData.push({
          genre,
          naSales,
          palSales,
          jpSales,
          otherSales,
          totalSales: genreItem.totalSales,
          gameCount: genreItem.gameCount,
          averageSales: genreItem.totalSales / genreItem.gameCount,
          averageScore: avgScore,
        });
      }
    }

    return comparisonData;
  };

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get selected genre data
  const selectedGenreData = genreData?.find((g) => g.genre === selectedGenre);

  // For genre comparison
  const { data: comparisonData, isLoading: isLoadingComparison } = useQuery({
    queryKey: ["genreComparison", comparedGenres],
    queryFn: getGenreComparisonData,
    enabled: compareMode && comparedGenres.length > 0,
  });

  // Prepare data for radar chart
  const prepareRadarData = (data: any[]) => {
    if (!data || !data.length) return [];

    // Normalize values for radar chart
    const maxSales = Math.max(...data.map((item) => item.totalSales));
    const maxAvgSales = Math.max(...data.map((item) => item.averageSales));
    const maxCount = Math.max(...data.map((item) => item.gameCount));
    const maxScore = Math.max(...data.map((item) => item.averageScore));

    return [
      {
        category: "Total Sales",
        fullMark: 100,
        ...data.reduce((obj, item) => {
          obj[item.genre] = (item.totalSales / maxSales) * 100;
          return obj;
        }, {}),
      },
      {
        category: "Game Count",
        fullMark: 100,
        ...data.reduce((obj, item) => {
          obj[item.genre] = (item.gameCount / maxCount) * 100;
          return obj;
        }, {}),
      },
      {
        category: "Sales per Game",
        fullMark: 100,
        ...data.reduce((obj, item) => {
          obj[item.genre] = (item.averageSales / maxAvgSales) * 100;
          return obj;
        }, {}),
      },
      {
        category: "Critic Score",
        fullMark: 100,
        ...data.reduce((obj, item) => {
          obj[item.genre] = ((item.averageScore || 0) / 10) * 100;
          return obj;
        }, {}),
      },
    ];
  };

  const radarData = prepareRadarData(comparisonData || []);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Genre Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore game genres, their popularity, sales performance, and platform
          distribution.
        </p>
      </motion.div>

      {/* Genre Comparison Toggle */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            Analysis Mode
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => {
                setCompareMode(false);
                setComparedGenres([]);
              }}
              className={`px-4 py-2 rounded-l-md transition ${
                !compareMode
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Single Genre
            </button>
            <button
              onClick={() => setCompareMode(true)}
              className={`px-4 py-2 rounded-r-md transition ${
                compareMode
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Compare Genres
            </button>
          </div>
        </div>
        {compareMode && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Select up to 5 genres to compare:
            </p>
            <div className="flex flex-wrap gap-2">
              {genreData &&
                genreData.map((genre) => (
                  <button
                    key={genre.genre}
                    onClick={() => toggleCompareGenre(genre.genre)}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      comparedGenres.includes(genre.genre)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {genre.genre}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Genre Comparison View */}
      {compareMode && (
        <>
          {comparedGenres.length > 0 ? (
            <div className="space-y-6">
              {/* Radar Chart Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Genre Comparison
                </h2>
                {isLoadingComparison ? (
                  <div className="flex justify-center py-8">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        outerRadius={150}
                        width={730}
                        height={400}
                        data={radarData}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {comparedGenres.map((genre, index) => (
                          <Radar
                            key={genre}
                            name={genre}
                            dataKey={genre}
                            stroke={COLORS[index % COLORS.length]}
                            fill={COLORS[index % COLORS.length]}
                            fillOpacity={0.6}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Radar chart compares genres across multiple metrics
                  (normalized to percentage).
                </p>
              </motion.div>

              {/* Bar Chart Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Total Sales Comparison
                </h2>
                {isLoadingComparison ? (
                  <div className="flex justify-center py-8">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="genre" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `${Number(value).toFixed(2)}M`}
                        />
                        <Legend />
                        <Bar
                          dataKey="totalSales"
                          name="Total Sales (M)"
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>

              {/* Regional Sales Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Regional Sales Distribution
                </h2>
                {isLoadingComparison ? (
                  <div className="flex justify-center py-8">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="genre" type="category" />
                        <Tooltip
                          formatter={(value) => `${Number(value).toFixed(2)}M`}
                        />
                        <Legend />
                        <Bar
                          dataKey="naSales"
                          name="North America"
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="palSales"
                          name="Europe/PAL"
                          stackId="a"
                          fill="#82ca9d"
                        />
                        <Bar
                          dataKey="jpSales"
                          name="Japan"
                          stackId="a"
                          fill="#ffc658"
                        />
                        <Bar
                          dataKey="otherSales"
                          name="Other Regions"
                          stackId="a"
                          fill="#ff7300"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>

              {/* Game Count Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Game Count & Sales Per Game
                </h2>
                {isLoadingComparison ? (
                  <div className="flex justify-center py-8">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="genre" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "Game Count")
                              return formatNumber(Number(value));
                            return `${Number(value).toFixed(2)}M`;
                          }}
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="gameCount"
                          name="Game Count"
                          fill="#8884d8"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="averageSales"
                          name="Sales per Game (M)"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Select Genres to Compare
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose at least one genre from the list above to begin
                comparison
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Single Genre Analysis View */}
      {!compareMode && (
        <>
          {/* Genre Distribution Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Genre Sales Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Sales by Genre
              </h2>
              {isLoadingGenres ? (
                <div className="flex justify-center py-8">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genreData?.sort(
                        (a, b) => b.totalSales - a.totalSales
                      )}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="genre"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => `${Number(value).toFixed(2)}M`}
                      />
                      <Legend />
                      <Bar
                        dataKey="totalSales"
                        name="Global Sales (M)"
                        fill="#8884d8"
                        onClick={(data) => setSelectedGenre(data.genre)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Click on any bar to see genre details
              </p>
            </motion.div>

            {/* Genre Game Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Game Count by Genre
              </h2>
              {isLoadingGenres ? (
                <div className="flex justify-center py-8">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData?.sort(
                          (a, b) => b.gameCount - a.gameCount
                        )}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="gameCount"
                        nameKey="genre"
                        label={({ genre, percent }) =>
                          `${genre}: ${(percent * 100).toFixed(1)}%`
                        }
                        onClick={(data) => setSelectedGenre(data.genre)}
                      >
                        {genreData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatNumber(Number(value))}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sales Efficiency by Genre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Sales per Game by Genre
            </h2>
            {isLoadingGenres ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={genreData
                      ?.map((genre) => ({
                        ...genre,
                        salesPerGame: genre.totalSales / genre.gameCount,
                      }))
                      .sort((a, b) => b.salesPerGame - a.salesPerGame)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `${Number(value).toFixed(2)}M`}
                      labelFormatter={(label) => `Genre: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="salesPerGame"
                      name="Sales per Game (M)"
                      fill="#82ca9d"
                      onClick={(data) => setSelectedGenre(data.genre)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Higher values indicate genres with greater commercial success per
              title
            </p>
          </motion.div>

          {/* Selected Genre Detail */}
          {selectedGenre && selectedGenreData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedGenre} - Genre Analysis
                </h2>
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Clear Selection
                </button>
              </div>

              {/* Genre Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Games
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(selectedGenreData.gameCount)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Global Sales
                  </div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedGenreData.totalSales.toFixed(2)}M
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Sales per Game
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {(
                      selectedGenreData.totalSales / selectedGenreData.gameCount
                    ).toFixed(2)}
                    M
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Avg Critic Score
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {getAverageCriticScore().toFixed(1)}/10
                  </div>
                </div>
              </div>

              {isLoadingGenreGames ? (
                <div className="flex justify-center py-8">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Distribution */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                      Top Platforms
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getTopConsoles().slice(0, 8)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ console, percent }) =>
                              `${console}: ${(percent * 100).toFixed(1)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="console"
                          >
                            {getTopConsoles()
                              .slice(0, 8)
                              .map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Publishers */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                      Top Publishers
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getTopPublishers().slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="publisher"
                            type="category"
                            width={100}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip
                            formatter={(value) => formatNumber(Number(value))}
                          />
                          <Bar
                            dataKey="count"
                            name="Game Count"
                            fill="#82ca9d"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Games in Genre */}
              {genreGames && genreGames.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                    Top {selectedGenre} Games by Sales
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Console
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Publisher
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {genreGames
                          .sort((a, b) => b.totalSales - a.totalSales)
                          .slice(0, 10)
                          .map((game, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {game.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {game.console}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {game.publisher}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                {game.criticScore ? (
                                  <span
                                    className={`px-2 py-1 rounded font-semibold 
                                      ${
                                        game.criticScore >= 8
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : game.criticScore >= 6
                                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      }`}
                                  >
                                    {game.criticScore}/10
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600 dark:text-indigo-400 font-semibold">
                                {game.totalSales.toFixed(2)}M
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default GenreAnalysis;
