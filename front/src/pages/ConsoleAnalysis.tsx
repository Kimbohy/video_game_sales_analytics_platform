import { useState, useEffect, useRef } from "react";
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
import { ConsoleAnalysisGuide } from "../components/layout/guides/ConsoleAnalysisGuide";

const ConsoleAnalysis = () => {
  const [selectedConsole, setSelectedConsole] = useState<string | null>(null);
  const [consoleGroups, setConsoleGroups] = useState<
    { name: string; consoles: string[] }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const platformDetailsRef = useRef<HTMLDivElement>(null);

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

  // Fetch console top genres data using SQL
  const { data: consoleTopGenres, isLoading: isLoadingConsoleGenres } =
    useQuery({
      queryKey: ["consoleTopGenres", selectedConsole],
      queryFn: () => gameService.getConsoleTopGenres(selectedConsole!),
      enabled: !!selectedConsole,
    });

  // Fetch console groups data from SQL
  const { data: consoleGroupsData, isLoading: _ } = useQuery({
    queryKey: ["consoleGroups"],
    queryFn: () => gameService.getConsoleGroups(),
  });

  // Fetch sales efficiency data from SQL
  const { data: salesEfficiencyData, isLoading: isLoadingSalesEfficiency } =
    useQuery({
      queryKey: ["consoleEfficiency"],
      queryFn: () => gameService.getConsoleSalesEfficiency(),
    });

  // Create console family groups from backend data
  useEffect(() => {
    if (consoleGroupsData) {
      const groupMap = new Map<string, string[]>();

      consoleGroupsData.forEach((item) => {
        if (!groupMap.has(item.groupName)) {
          groupMap.set(item.groupName, []);
        }
        groupMap.get(item.groupName)!.push(item.platform);
      });

      // Convert map to array of groups
      const groups = Array.from(groupMap.entries()).map(([name, consoles]) => ({
        name,
        consoles,
      }));

      setConsoleGroups(groups);
    }
  }, [consoleGroupsData]);

  // Effect to scroll to platform details when selectedConsole changes
  useEffect(() => {
    if (selectedConsole && platformDetailsRef.current) {
      // Add small delay to ensure the component has rendered
      setTimeout(() => {
        // Calculate position with offset to account for the navbar height
        const yOffset = -80; // Adjust this value based on your navbar height
        const element = platformDetailsRef.current;
        if (element) {
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [selectedConsole]);

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

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get selected console data
  const selectedConsoleData = platformData?.find(
    (p) => p.platform === selectedConsole
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Add the ConsoleAnalysisGuide component */}
      <ConsoleAnalysisGuide />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Console Sales Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare gaming platforms and analyze their sales performance, game
          libraries, and regional popularity.
        </p>
      </motion.div>

      {/* Console Group Filter */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
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
          ref={platformDetailsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedConsole} - Platform Details
            </h2>
            <button
              onClick={() => setSelectedConsole(null)}
              className="px-2 py-1 text-sm text-gray-600 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear Selection
            </button>
          </div>

          {/* Console Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Games
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(selectedConsoleData.gameCount)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Global Sales
              </div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {selectedConsoleData.globalSales.toFixed(2)}M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sales per Game
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {salesEfficiencyData
                  ?.find((item) => item.platform === selectedConsole)
                  ?.salesPerGame.toFixed(2) ||
                  (
                    selectedConsoleData.globalSales /
                    selectedConsoleData.gameCount
                  ).toFixed(2)}
                M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
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

          {isLoadingConsoleGames || isLoadingConsoleGenres ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Regional Sales Distribution */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-800 text-md dark:text-white">
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
                          (_, index) => (
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
                <h3 className="mb-3 font-semibold text-gray-800 text-md dark:text-white">
                  Top Genres
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={consoleTopGenres?.slice(0, 5)}
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
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Total Sales by Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Total Sales by Platform
          </h2>
          {isLoadingPlatforms ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
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
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Click on any bar to see platform details
          </p>
        </motion.div>

        {/* Market Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Market Share by Platform
          </h2>
          {isLoadingPlatforms ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
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
                    {platformSalesPercentages.slice(0, 10).map((_, index) => (
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
        className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Platform Efficiency (Sales per Game)
        </h2>

        {isLoadingPlatforms || isLoadingSalesEfficiency ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 40, right: 20, bottom: 40, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                  type="number"
                  dataKey="gameCount"
                  name="Game Count"
                  label={{
                    value: "Game Library Size",
                    position: "insideBottom",
                    offset: -10,
                  }}
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => formatNumber(val)}
                />
                <YAxis
                  type="number"
                  dataKey="salesPerGame"
                  name="Sales per Game"
                  label={{
                    value: "Sales per Game (M)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -45,
                  }}
                  tickFormatter={(val) => val.toFixed(1)}
                />
                <ZAxis
                  type="number"
                  dataKey="globalSales"
                  range={[60, 700]}
                  name="Total Sales"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "Sales per Game")
                      return [`${Number(value).toFixed(2)}M`, name];
                    if (name === "Game Count")
                      return [formatNumber(Number(value)), name];
                    if (name === "Total Sales")
                      return [`${Number(value).toFixed(2)}M`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-white border border-gray-200 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700">
                          <p className="mb-1 text-base font-bold">
                            {data.platform}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Games:
                            </p>
                            <p className="text-sm font-medium text-right">
                              {formatNumber(data.gameCount)}
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Sales/Game:
                            </p>
                            <p className="text-sm font-medium text-right text-indigo-600 dark:text-indigo-400">
                              {data.salesPerGame.toFixed(2)}M
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total Sales:
                            </p>
                            <p className="text-sm font-medium text-right">
                              {data.globalSales.toFixed(2)}M
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  payload={[
                    { value: "Nintendo", type: "circle", color: "#0088FE" },
                    { value: "PlayStation", type: "circle", color: "#FF8042" },
                    { value: "Xbox", type: "circle", color: "#00C49F" },
                    { value: "Sega", type: "circle", color: "#8884d8" },
                    { value: "PC", type: "circle", color: "#FFBB28" },
                    { value: "Other", type: "circle", color: "#AAAAAA" },
                  ]}
                  verticalAlign="top"
                  height={36}
                  layout="horizontal"
                  wrapperStyle={{ paddingTop: 0, paddingBottom: 10 }}
                />
                <Scatter
                  name="Platforms"
                  data={salesEfficiencyData}
                  fill="#8884d8"
                  fillOpacity={0.8}
                  onClick={(data) => setSelectedConsole(data.platform)}
                >
                  {salesEfficiencyData?.map((entry, index) => {
                    // Assign colors based on console families
                    let color = "#8884d8"; // Default color

                    // Nintendo consoles - blue
                    if (
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
                      ].includes(entry.platform)
                    ) {
                      color = "#0088FE"; // Blue
                    }
                    // PlayStation consoles - red
                    else if (
                      ["PS", "PS2", "PS3", "PS4", "PS5", "PSP", "PSV"].includes(
                        entry.platform
                      )
                    ) {
                      color = "#FF8042"; // Orange/red
                    }
                    // Xbox consoles - green
                    else if (
                      ["XB", "X360", "XOne", "XS"].includes(entry.platform)
                    ) {
                      color = "#00C49F"; // Green
                    }
                    // Sega consoles - purple
                    else if (
                      ["GEN", "SCD", "32X", "SAT", "DC", "GG", "PICO"].includes(
                        entry.platform
                      )
                    ) {
                      color = "#8884d8"; // Purple
                    }
                    // Other platforms
                    else if (entry.platform === "PC") {
                      color = "#FFBB28"; // Yellow
                    }

                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Top Consoles by Efficiency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Top Platforms by Sales Efficiency
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
                >
                  Platform
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300"
                >
                  Sales per Game
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300"
                >
                  Game Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300"
                >
                  Total Sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {salesEfficiencyData?.slice(0, 10).map((item, index) => (
                <tr
                  key={item.platform}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setSelectedConsole(item.platform)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.platform}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap dark:text-white">
                    {item.salesPerGame.toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {formatNumber(item.gameCount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-indigo-600 whitespace-nowrap dark:text-indigo-400">
                    {item.globalSales.toFixed(2)}M
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
