import { GenreSales } from "../../api/gameService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GenreDistributionChartProps {
  data: GenreSales[];
  onSliceClick?: (genre: string) => void;
  isLoading?: boolean;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#EA4C89",
  "#9B51E0",
  "#FF6B6B",
  "#4ECDC4",
];

// Threshold for grouping genres into "Other" category (in percentage)
const OTHER_THRESHOLD_PERCENT = 3;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {data.genre}
        </p>
        <p className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-300">Total Sales:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {data.totalSales.toFixed(2)}M
          </span>
        </p>
        {data.genre === "Other" && data.genreCount && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Contains {data.genreCount} genres
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload, onSliceClick }: any) => {
  return (
    <ul className="flex flex-wrap justify-center gap-2 mt-4 text-gray-600 dark:text-gray-300">
      {payload.map((entry: any, index: number) => (
        <li
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm transition-colors rounded-full cursor-pointer"
          style={{
            backgroundColor: `${entry.color}15`,
            color: entry.color,
          }}
          onClick={() => onSliceClick?.(entry.value)}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

// Animation variants for chart container
const chartContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Animation variants for button
const buttonVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const GenreDistributionChart = ({
  data,
  onSliceClick,
  isLoading = false,
}: GenreDistributionChartProps) => {
  // State to track if we're showing "Other" details
  const [showOtherDetails, setShowOtherDetails] = useState(false);
  // Store small genres that make up "Other"
  const [smallGenres, setSmallGenres] = useState<GenreSales[]>([]);

  // Process data to group small genres into "Other" category
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Calculate the total sales across all genres
    const totalSales = data.reduce((sum, d) => sum + d.totalSales, 0);

    // Threshold value in sales units
    const threshold = (totalSales * OTHER_THRESHOLD_PERCENT) / 100;

    // Separate genres into main genres and small genres
    const mainGenres: GenreSales[] = [];
    const smallGenresArray: GenreSales[] = [];

    data.forEach((genre) => {
      if (genre.totalSales >= threshold) {
        mainGenres.push(genre);
      } else {
        smallGenresArray.push(genre);
      }
    });

    // Store small genres for later use
    setSmallGenres(smallGenresArray);

    // If there are small genres, create an "Other" category
    if (smallGenresArray.length > 0) {
      const otherGenre: GenreSales & { genreCount?: number } = {
        genre: "Other",
        totalSales: smallGenresArray.reduce((sum, g) => sum + g.totalSales, 0),
        gameCount: smallGenresArray.reduce((sum, g) => sum + g.gameCount, 0),
        genreCount: smallGenresArray.length,
      };

      return [...mainGenres, otherGenre];
    }

    return mainGenres;
  }, [data]);

  // Choose which data to display based on state
  const displayData = useMemo(() => {
    if (showOtherDetails && smallGenres.length > 0) {
      return smallGenres;
    }
    return processedData;
  }, [showOtherDetails, smallGenres, processedData]);

  // Add total to each data point
  const dataWithTotal = displayData.map((item) => ({
    ...item,
    total: data.reduce((sum, d) => sum + d.totalSales, 0),
  }));

  // Handle click on a chart slice
  const handleSliceClick = (genre: string) => {
    if (genre === "Other") {
      setShowOtherDetails(!showOtherDetails);
    } else if (showOtherDetails) {
      // If we're showing small genres and click on one of them, handle it normally
      // but also return to the main view
      onSliceClick?.(genre);
      setShowOtherDetails(false);
    } else {
      onSliceClick?.(genre);
    }
  };

  return (
    <ChartWrapper
      title={
        showOtherDetails ? "Genres in 'Other' Category" : "Genre Distribution"
      }
      isLoading={isLoading}
    >
      <div className="w-full h-[400px] text-gray-600 dark:text-gray-300 relative">
        <AnimatePresence mode="wait">
          {showOtherDetails && (
            <motion.div
              className="absolute top-0 left-0 z-10 mb-3"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                onClick={() => setShowOtherDetails(false)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 transition-all rounded-md shadow-sm bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 hover:shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Main Genres
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={showOtherDetails ? "other-view" : "main-view"}
            className="w-full h-full"
            variants={chartContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithTotal}
                  dataKey="totalSales"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={1}
                  onClick={(data) => handleSliceClick(data.genre)}
                  cursor="pointer"
                  label={{
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {dataWithTotal.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  content={<CustomLegend onSliceClick={handleSliceClick} />}
                  wrapperStyle={{ color: "currentColor" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </ChartWrapper>
  );
};
