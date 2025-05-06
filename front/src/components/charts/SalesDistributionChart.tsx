import { PlatformSales } from "../../api/gameService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SalesDistributionChartProps {
  data: PlatformSales[];
  onBarClick?: (platform: string) => void;
  isLoading?: boolean;
}

// Threshold for filtering platforms (in millions)
const SALES_THRESHOLD = 12.07;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalSales = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );

    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.value.toFixed(2)}M
            </span>
          </p>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Total: {totalSales.toFixed(2)}M
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Animation variants for button
const buttonVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Animation variants for chart container
const chartContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const SalesDistributionChart = ({
  data,
  onBarClick,
  isLoading = false,
}: SalesDistributionChartProps) => {
  // State to track if we're showing all platforms
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  // Process data to filter platforms by sales threshold
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .map((item) => ({
        ...item,
        totalSales:
          item.naSales + item.palSales + item.jpSales + item.otherSales,
      }))
      .filter((item) => {
        if (showAllPlatforms) {
          return true;
        }
        return item.totalSales >= SALES_THRESHOLD;
      });
  }, [data, showAllPlatforms]);

  // Count of platforms hidden by the filter
  const hiddenPlatformsCount = useMemo(() => {
    if (!data) return 0;
    const allPlatformsCount = data.length;
    const visiblePlatformsCount = processedData.length;
    return allPlatformsCount - visiblePlatformsCount;
  }, [data, processedData]);

  // Custom chart title component that includes the toggle button
  const CustomChartTitle = () => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Sales Distribution by Platform
      </h3>
      <div className="flex items-center">
        {/* <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">
          {showAllPlatforms
            ? "all platforms"
            : `Platforms ≥${SALES_THRESHOLD}M`}
        </span> */}
        <AnimatePresence mode="wait">
          {!showAllPlatforms && hiddenPlatformsCount > 0 && (
            <motion.button
              onClick={() => setShowAllPlatforms(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 transition-all rounded-md shadow-sm bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 hover:shadow"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
              Show All ({hiddenPlatformsCount} more)
            </motion.button>
          )}

          {showAllPlatforms && (
            <motion.button
              onClick={() => setShowAllPlatforms(false)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 transition-all rounded-md shadow-sm bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 hover:shadow"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
                  d="M4 8h16M4 16h16"
                />
              </svg>
              Show Top Platforms
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <CustomChartTitle />

      <div className="w-full h-[400px] text-gray-600 dark:text-gray-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={showAllPlatforms ? "all-platforms-view" : "filtered-view"}
            className="w-full h-full"
            variants={chartContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.5}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="platform"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                  axisLine={{ stroke: "currentColor" }}
                  label={{
                    value: "Platform",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "currentColor" },
                  }}
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                  axisLine={{ stroke: "currentColor" }}
                  label={{
                    value: "Sales (Millions)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "currentColor" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar
                  dataKey="naSales"
                  name="North America"
                  stackId="a"
                  fill="#8884d8"
                  onClick={(data) => onBarClick?.(data.platform)}
                  cursor="pointer"
                />
                <Bar
                  dataKey="palSales"
                  name="Europe/PAL"
                  stackId="a"
                  fill="#82ca9d"
                  onClick={(data) => onBarClick?.(data.platform)}
                  cursor="pointer"
                />
                <Bar
                  dataKey="jpSales"
                  name="Japan"
                  stackId="a"
                  fill="#ffc658"
                  onClick={(data) => onBarClick?.(data.platform)}
                  cursor="pointer"
                />
                <Bar
                  dataKey="otherSales"
                  name="Other"
                  stackId="a"
                  fill="#ff7300"
                  onClick={(data) => onBarClick?.(data.platform)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
