import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "../api/gameService";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
  Brush,
} from "recharts";

const GamesReleasedAnalysis = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const yearAnalysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedYear && yearAnalysisRef.current) {
      // Add a small delay to ensure the component is rendered
      setTimeout(() => {
        // Scroll with offset to account for the nav bar height
        const yOffset = -80; // Adjust this value based on your nav bar height
        const element = yearAnalysisRef.current;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [selectedYear]);

  // Fetch timeline data
  const { data: timelineData, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ["timelineData"],
    queryFn: () => gameService.getTimelineData(),
  });

  // Fetch growth data directly from SQL
  const { data: growthData, isLoading: isLoadingGrowth } = useQuery({
    queryKey: ["growthData"],
    queryFn: () => gameService.getTimelineGrowthData(),
  });

  // Fetch sales per game data directly from SQL
  const { data: salesPerGameData, isLoading: isLoadingSalesPerGame } = useQuery(
    {
      queryKey: ["salesPerGameData"],
      queryFn: () => gameService.getSalesPerGameData(),
    }
  );

  // Fetch games for a specific year when selected
  const { data: yearGames, isLoading: isLoadingYearGames } = useQuery({
    queryKey: ["yearGames", selectedYear],
    queryFn: () => gameService.getGamesByYear(selectedYear!),
    enabled: !!selectedYear,
  });

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get filtered timeline data based on selected timeframe
  const getFilteredTimelineData = () => {
    if (!timelineData || timelineData.length === 0) return [];

    // Always sort data by year first to ensure chronological display
    const sortedData = [...timelineData].sort((a, b) => a.year - b.year);

    if (selectedTimeframe === "all") return sortedData;

    const latestYear = sortedData[sortedData.length - 1].year;
    let startYear = latestYear;

    switch (selectedTimeframe) {
      case "10years":
        startYear = latestYear - 10;
        break;
      case "20years":
        startYear = latestYear - 20;
        break;
      case "30years":
        startYear = latestYear - 30;
        break;
      default:
        return sortedData;
    }

    return sortedData.filter((item) => item.year >= startYear);
  };

  const filteredTimelineData = getFilteredTimelineData();

  // Get filtered growth data based on selected timeframe
  const getFilteredGrowthData = () => {
    if (!growthData || growthData.length === 0) return [];

    if (selectedTimeframe === "all") return growthData;

    // Use the same filtering logic as for timeline data
    const sortedTimelineData = [...timelineData!].sort(
      (a, b) => a.year - b.year
    );
    const latestYear = sortedTimelineData[sortedTimelineData.length - 1].year;
    let startYear = latestYear;

    switch (selectedTimeframe) {
      case "10years":
        startYear = latestYear - 10;
        break;
      case "20years":
        startYear = latestYear - 20;
        break;
      case "30years":
        startYear = latestYear - 30;
        break;
      default:
        return growthData;
    }

    return growthData.filter((item) => item.Year >= startYear);
  };

  // Get filtered sales per game data
  const getFilteredSalesPerGameData = () => {
    if (!salesPerGameData || salesPerGameData.length === 0) return [];

    if (selectedTimeframe === "all") return salesPerGameData;

    // Use the same filtering logic as for timeline data
    const sortedTimelineData = [...timelineData!].sort(
      (a, b) => a.year - b.year
    );
    const latestYear = sortedTimelineData[sortedTimelineData.length - 1].year;
    let startYear = latestYear;

    switch (selectedTimeframe) {
      case "10years":
        startYear = latestYear - 10;
        break;
      case "20years":
        startYear = latestYear - 20;
        break;
      case "30years":
        startYear = latestYear - 30;
        break;
      default:
        return salesPerGameData;
    }

    return salesPerGameData.filter((item) => item.year >= startYear);
  };

  // Extract significant years from the growth data
  const getSignificantYears = () => {
    if (!growthData) return [];

    return growthData
      .filter(
        (item) => item.IsPeak || item.IsValley || item.IsSignificantChange
      )
      .map((item) => {
        const events = [];
        if (item.IsPeak) events.push("Peak in game releases");
        if (item.IsValley) events.push("Decline in game releases");
        if (item.IsSignificantChange) {
          events.push(
            item.ChangeDirection === "growth"
              ? "Significant growth in releases"
              : "Significant decline in releases"
          );
        }

        return {
          year: item.Year,
          gameCount: item.GameCount,
          globalSales: item.GlobalSales,
          events: events,
          growthRate: item.GameCountGrowth,
        };
      })
      .sort((a, b) => a.year - b.year);
  };

  const significantYears = getSignificantYears();

  // Get top genres for selected year
  const getTopGenresForYear = () => {
    if (!yearGames) return [];

    const genreCounts: { [key: string]: { count: number; sales: number } } = {};

    yearGames.forEach((game) => {
      if (!genreCounts[game.genre]) {
        genreCounts[game.genre] = { count: 0, sales: 0 };
      }
      genreCounts[game.genre].count++;
      genreCounts[game.genre].sales += game.totalSales;
    });

    return Object.entries(genreCounts)
      .map(([genre, data]) => ({
        genre,
        count: data.count,
        sales: data.sales,
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Get top platforms for selected year
  const getTopPlatformsForYear = () => {
    if (!yearGames) return [];

    const platformCounts: { [key: string]: { count: number; sales: number } } =
      {};

    yearGames.forEach((game) => {
      if (!platformCounts[game.console]) {
        platformCounts[game.console] = { count: 0, sales: 0 };
      }
      platformCounts[game.console].count++;
      platformCounts[game.console].sales += game.totalSales;
    });

    return Object.entries(platformCounts)
      .map(([platform, data]) => ({
        platform,
        count: data.count,
        sales: data.sales,
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Get top publishers for selected year
  const getTopPublishersForYear = () => {
    if (!yearGames) return [];

    const publisherCounts: { [key: string]: { count: number; sales: number } } =
      {};

    yearGames.forEach((game) => {
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
      .sort((a, b) => b.count - a.count);
  };

  // Get selected year data
  const selectedYearData = timelineData?.find(
    (item) => item.year === selectedYear
  );

  // Get selected year growth data
  const selectedYearGrowthData = growthData?.find(
    (item) => item.year === selectedYear
  );

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Games Released Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore trends in game releases over time, including volume, sales
          performance, and market conditions.
        </p>
      </motion.div>

      {/* Time Range Selector */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Select Time Range
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTimeframe("all")}
            className={`px-4 py-2 rounded-md transition ${
              selectedTimeframe === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setSelectedTimeframe("30years")}
            className={`px-4 py-2 rounded-md transition ${
              selectedTimeframe === "30years"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Last 30 Years
          </button>
          <button
            onClick={() => setSelectedTimeframe("20years")}
            className={`px-4 py-2 rounded-md transition ${
              selectedTimeframe === "20years"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Last 20 Years
          </button>
          <button
            onClick={() => setSelectedTimeframe("10years")}
            className={`px-4 py-2 rounded-md transition ${
              selectedTimeframe === "10years"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Last 10 Years
          </button>
        </div>
      </div>

      {/* Selected Year Detail */}
      {selectedYear && selectedYearData && (
        <motion.div
          ref={yearAnalysisRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedYear} - Year Analysis
            </h2>
            <button
              onClick={() => setSelectedYear(null)}
              className="px-2 py-1 text-sm text-gray-600 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear Selection
            </button>
          </div>

          {/* Year Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Games
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(selectedYearData.gameCount)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Sales
              </div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {selectedYearData.globalSales.toFixed(2)}M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sales per Game
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {salesPerGameData
                  ?.find((d) => d.year === selectedYear)
                  ?.salesPerGame.toFixed(2) ||
                  (
                    selectedYearData.globalSales / selectedYearData.gameCount
                  ).toFixed(2)}
                M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Year-over-Year Growth
              </div>
              {selectedYearGrowthData ? (
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedYearGrowthData.gameCountGrowth.toFixed(1)}%
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  N/A
                </div>
              )}
            </div>
          </div>

          {isLoadingYearGames ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Top Genres */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-800 text-md dark:text-white">
                  Top Genres in {selectedYear}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTopGenresForYear().slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="genre" type="category" width={70} />
                      <Tooltip
                        formatter={(value) => formatNumber(Number(value))}
                      />
                      <Bar dataKey="count" name="Games" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Platforms */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-800 text-md dark:text-white">
                  Top Platforms in {selectedYear}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTopPlatformsForYear().slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="platform" type="category" width={40} />
                      <Tooltip
                        formatter={(value) => formatNumber(Number(value))}
                      />
                      <Bar dataKey="count" name="Games" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Top Publishers in Year */}
          {yearGames && yearGames.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-gray-800 text-md dark:text-white">
                Top Publishers in {selectedYear}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                        Publisher
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                        Games
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                        Total Sales
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                        Sales per Game
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {getTopPublishersForYear()
                      .slice(0, 10)
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.publisher}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                            {formatNumber(item.count)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                            {item.sales.toFixed(2)}M
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-right text-indigo-600 whitespace-nowrap dark:text-indigo-400">
                            {(item.sales / item.count).toFixed(2)}M
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

      {/* Main Chart - Games Released Over Time */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Games Released Over Time
          </h2>
          {isLoadingTimeline ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : filteredTimelineData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredTimelineData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    angle={-45}
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={70}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#8884d8"
                    label={{
                      value: "Game Count",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    label={{
                      value: "Sales (M)",
                      angle: -90,
                      position: "insideRight",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "Game Count")
                        return formatNumber(Number(value));
                      if (name === "Total Sales")
                        return `${Number(value).toFixed(2)}M`;
                      return value;
                    }}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="gameCount"
                    name="Game Count"
                    fill="#8884d8"
                    stroke="#8884d8"
                    fillOpacity={0.3}
                    activeDot={{
                      onClick: (data, index) => {
                        console.log("Area chart clicked:", data);
                        setSelectedYear(data.payload.year);
                      },
                      r: 8,
                      style: { cursor: "pointer" },
                    }}
                    onClick={(data) => {
                      console.log("Area segment clicked:", data);
                      if (data && data.activePayload && data.activePayload[0]) {
                        setSelectedYear(data.activePayload[0].payload.year);
                      }
                    }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="globalSales"
                    name="Total Sales"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{
                      r: 6,
                      onClick: (data) => {
                        console.log("Line chart dot clicked:", data);
                        setSelectedYear(data.payload.year);
                      },
                      style: { cursor: "pointer" },
                    }}
                    activeDot={{
                      r: 8,
                      onClick: (event, data) => {
                        console.log(
                          "Line chart activeDot clicked:",
                          event,
                          data
                        );
                        // Access the year from the data parameter instead
                        if (data && data.payload) {
                          setSelectedYear(data.payload.year);
                        }
                      },
                      style: { cursor: "pointer" },
                    }}
                    onClick={(data) => {
                      console.log("Line segment clicked:", data);
                      if (data && data.activePayload && data.activePayload[0]) {
                        setSelectedYear(data.activePayload[0].payload.year);
                      }
                    }}
                  />
                  <Brush
                    dataKey="year"
                    height={30}
                    stroke="#8884d8"
                    startIndex={0}
                    endIndex={filteredTimelineData.length - 1}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">
              No timeline data available for the selected timeframe
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Click on any point to see details for that year. Use the brush below
            to zoom into specific periods.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Growth Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Year-over-Year Growth
          </h2>
          {isLoadingGrowth ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={getFilteredGrowthData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="Year"
                    angle={-45}
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis
                    label={{
                      value: "Growth %",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)}%`}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="GameCountGrowth"
                    name="Games Growth %"
                    fill="#8884d8"
                    onClick={(data) => {
                      console.log("Bar chart clicked:", data);
                      setSelectedYear(data.Year || data.year);
                    }}
                    cursor="pointer"
                    style={{ cursor: "pointer" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="SalesGrowth"
                    name="Sales Growth %"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{
                      onClick: (data) => {
                        console.log("Dot clicked:", data);
                        setSelectedYear(data.payload.Year || data.payload.year);
                      },
                      r: 5,
                      style: { cursor: "pointer" },
                    }}
                    activeDot={{
                      r: 7,
                      onClick: (event, data) => {
                        console.log("Active dot clicked:", event, data);
                        if (data && data.payload) {
                          setSelectedYear(
                            data.payload.Year || data.payload.year
                          );
                        }
                      },
                      style: { cursor: "pointer" },
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Sales per Game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Sales per Game Over Time
          </h2>
          {isLoadingSalesPerGame ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredSalesPerGameData()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    angle={-45}
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis
                    label={{
                      value: "Sales per Game (M)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)}M`}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="salesPerGame"
                    name="Sales per Game (M)"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{
                      onClick: (data) => setSelectedYear(data.payload.year),
                      r: 5,
                      style: { cursor: "pointer" },
                    }}
                    activeDot={{
                      r: 8,
                      onClick: (event, data) => {
                        console.log("Active dot clicked:", event, data);
                        if (data && data.payload) {
                          setSelectedYear(data.payload.year);
                        }
                      },
                      style: { cursor: "pointer" },
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Significant Game Industry Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Significant Years in Game Releases
        </h2>
        {isLoadingGrowth ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : significantYears.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Year
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                    Events
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                    Game Count
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                    Growth Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {significantYears
                  .filter((year) =>
                    filteredTimelineData.some((item) => item.year === year.year)
                  )
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setSelectedYear(item.year)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {item.events.map((event, i) => (
                          <span
                            key={i}
                            className={`inline-block px-2 py-1 mr-2 mb-1 text-xs rounded ${
                              event.includes("Peak") || event.includes("growth")
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {event}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                        {formatNumber(item.gameCount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        {item.growthRate !== undefined ? (
                          <span
                            className={`px-2 py-1 rounded font-semibold 
                            ${
                              item.growthRate > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {item.growthRate > 0 ? "+" : ""}
                            {item.growthRate}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500 dark:text-gray-400">
            No significant events found in the current time range
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default GamesReleasedAnalysis;
