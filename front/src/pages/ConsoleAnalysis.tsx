import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService, PlatformSales } from "../api/gameService";
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
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const ConsoleAnalysis = () => {
  const [selectedConsole, setSelectedConsole] = useState<string | null>(null);
  const [consoleGroups, setConsoleGroups] = useState<
    { name: string; consoles: string[] }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Fetch all console data
  const { data: platformData, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ["consoleSalesData"],
    queryFn: () => gameService.getConsoleSalesDistribution(),
  });

  // Fetch data for a specific console
  const { data: consoleGames, isLoading: isLoadingConsoleGames } = useQuery({
    queryKey: ["consoleGames", selectedConsole],
    queryFn: () => gameService.getGamesByConsole(selectedConsole!),
    enabled: !!selectedConsole,
  });

  // Define console manufacturers/generations for grouping
  useEffect(() => {
    if (platformData) {
      // Create console family groups
      const groups = [
        {
          name: "Nintendo",
          consoles: platformData
            .filter((p) =>
              [
                "NES",
                "SNES",
                "N64",
                "GC",
                "Wii",
                "Wii U",
                "Switch",
                "GB",
                "GBA",
                "DS",
                "3DS",
                "Virtual Boy",
              ].includes(p.platform)
            )
            .map((p) => p.platform),
        },
        {
          name: "PlayStation",
          consoles: platformData
            .filter((p) =>
              ["PS", "PS2", "PS3", "PS4", "PS5", "PSP", "PSV"].includes(
                p.platform
              )
            )
            .map((p) => p.platform),
        },
        {
          name: "Xbox",
          consoles: platformData
            .filter((p) => ["XB", "X360", "XOne", "XS"].includes(p.platform))
            .map((p) => p.platform),
        },
        {
          name: "Sega",
          consoles: platformData
            .filter((p) =>
              ["GEN", "SCD", "32X", "SAT", "DC", "GG", "PICO"].includes(
                p.platform
              )
            )
            .map((p) => p.platform),
        },
        {
          name: "PC",
          consoles: platformData
            .filter((p) => ["PC"].includes(p.platform))
            .map((p) => p.platform),
        },
        {
          name: "Mobile",
          consoles: platformData
            .filter((p) => ["Mobile", "iOS", "Android"].includes(p.platform))
            .map((p) => p.platform),
        },
        {
          name: "Other",
          consoles: platformData
            .filter(
              (p) =>
                ![
                  "NES",
                  "SNES",
                  "N64",
                  "GC",
                  "Wii",
                  "Wii U",
                  "Switch",
                  "GB",
                  "GBA",
                  "DS",
                  "3DS",
                  "Virtual Boy",
                  "PS",
                  "PS2",
                  "PS3",
                  "PS4",
                  "PS5",
                  "PSP",
                  "PSV",
                  "XB",
                  "X360",
                  "XOne",
                  "XS",
                  "GEN",
                  "SCD",
                  "32X",
                  "SAT",
                  "DC",
                  "GG",
                  "PICO",
                  "PC",
                  "Mobile",
                  "iOS",
                  "Android",
                ].includes(p.platform)
            )
            .map((p) => p.platform),
        },
      ].filter((g) => g.consoles.length > 0); // Remove empty groups

      setConsoleGroups(groups);
    }
  }, [platformData]);

  // Filter platform data by selected group
  const filteredPlatformData = platformData
    ? selectedGroup
      ? platformData.filter((p) => {
          const group = consoleGroups.find((g) => g.name === selectedGroup);
          return group ? group.consoles.includes(p.platform) : false;
        })
      : platformData
    : [];

  // Calculate platform market share percentages
  const totalSales = filteredPlatformData.reduce(
    (sum, p) => sum + p.globalSales,
    0
  );
  const platformSalesPercentages = filteredPlatformData.map((p) => ({
    ...p,
    sharePercent: (p.globalSales / totalSales) * 100,
  }));

  // COLORS for charts
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

  // Calculate regional sales distribution for pie chart
  const getRegionalSalesData = (consoleData: PlatformSales | undefined) => {
    if (!consoleData) return [];
    return [
      { name: "North America", value: consoleData.naSales },
      { name: "Europe/PAL", value: consoleData.palSales },
      { name: "Japan", value: consoleData.jpSales },
      { name: "Other", value: consoleData.otherSales },
    ];
  };

  // Get top genres for selected console
  const getTopGenres = () => {
    if (!consoleGames) return [];

    const genreCounts: { [key: string]: { count: number; sales: number } } = {};

    consoleGames.forEach((game) => {
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
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Sales efficiency (sales per game) data
  const salesEfficiencyData = filteredPlatformData
    .map((platform) => ({
      name: platform.platform,
      salesPerGame:
        platform.gameCount > 0 ? platform.globalSales / platform.gameCount : 0,
      gameCount: platform.gameCount,
      totalSales: platform.globalSales,
    }))
    .sort((a, b) => b.salesPerGame - a.salesPerGame);

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get selected console data
  const selectedConsoleData = platformData?.find(
    (p) => p.platform === selectedConsole
  );

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Console Sales Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare gaming platforms and analyze their sales performance, game
          libraries, and regional popularity.
        </p>
      </motion.div>

      {/* Console Group Filter */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Filter by Console Family
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-4 py-2 rounded-md transition ${
              !selectedGroup
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            All
          </button>
          {consoleGroups.map((group) => (
            <button
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
              className={`px-4 py-2 rounded-md transition ${
                selectedGroup === group.name
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Console Detail */}
      {selectedConsole && selectedConsoleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedConsole} - Platform Details
            </h2>
            <button
              onClick={() => setSelectedConsole(null)}
              className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Clear Selection
            </button>
          </div>

          {/* Console Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Games
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(selectedConsoleData.gameCount)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Global Sales
              </div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {selectedConsoleData.globalSales.toFixed(2)}M
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sales per Game
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {(
                  selectedConsoleData.globalSales /
                  selectedConsoleData.gameCount
                ).toFixed(2)}
                M
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Market Share
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {((selectedConsoleData.globalSales / totalSales) * 100).toFixed(
                  2
                )}
                %
              </div>
            </div>
          </div>

          {isLoadingConsoleGames ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regional Sales Distribution */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                  Regional Sales Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRegionalSalesData(selectedConsoleData)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getRegionalSalesData(selectedConsoleData).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${Number(value).toFixed(2)}M`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Genres on this Console */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                  Top Genres
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTopGenres().slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="genre"
                        type="category"
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} games`, "Count"]}
                      />
                      <Bar dataKey="count" fill="#8884d8" name="Games" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Console Sales Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Sales by Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Total Sales by Platform
          </h2>
          {isLoadingPlatforms ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformSalesPercentages.slice(0, 15)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="platform"
                    type="category"
                    width={50}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return name === "sharePercent"
                        ? [`${Number(value).toFixed(2)}%`, "Market Share"]
                        : [`${Number(value).toFixed(2)}M`, "Global Sales"];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="globalSales"
                    fill="#8884d8"
                    name="Global Sales (M)"
                    onClick={(data) => setSelectedConsole(data.platform)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Click on any bar to see platform details
          </p>
        </motion.div>

        {/* Market Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Market Share by Platform
          </h2>
          {isLoadingPlatforms ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformSalesPercentages.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, sharePercent }) =>
                      platform + ": " + sharePercent.toFixed(1) + "%"
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="globalSales"
                    nameKey="platform"
                    onClick={(data) => setSelectedConsole(data.platform)}
                  >
                    {platformSalesPercentages
                      .slice(0, 10)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)}M`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Sales Efficiency Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Platform Efficiency (Sales per Game)
        </h2>
        {isLoadingPlatforms ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="gameCount"
                  name="Game Count"
                  label={{
                    value: "Number of Games",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="salesPerGame"
                  name="Sales per Game"
                  label={{
                    value: "Sales per Game (M)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="totalSales"
                  range={[60, 600]}
                  name="Total Sales"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name, props) => {
                    if (name === "Sales per Game")
                      return [`${Number(value).toFixed(2)}M`, name];
                    if (name === "Total Sales")
                      return [`${Number(value).toFixed(2)}M`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
                          <p className="font-semibold">{data.name}</p>
                          <p>Games: {formatNumber(data.gameCount)}</p>
                          <p>Sales/Game: {data.salesPerGame.toFixed(2)}M</p>
                          <p>Total Sales: {data.totalSales.toFixed(2)}M</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter
                  name="Platforms"
                  data={salesEfficiencyData}
                  fill="#8884d8"
                  onClick={(data) => setSelectedConsole(data.name)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Bubble size represents total sales volume. Click on any bubble for
          details.
        </p>
      </motion.div>

      {/* Top Consoles by Efficiency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Top Platforms by Sales Efficiency
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Platform
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Sales per Game
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Game Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Total Sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {salesEfficiencyData.slice(0, 10).map((item, index) => (
                <tr
                  key={item.name}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedConsole(item.name)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {item.salesPerGame.toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatNumber(item.gameCount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600 dark:text-indigo-400">
                    {item.totalSales.toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleAnalysis;
