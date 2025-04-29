import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GameData } from "../../../api/gameService";
import {
  contentVariants,
  formatReleaseDate,
  hasSalesData,
  prepareSalesData,
  shouldShowLastUpdate,
  tabVariants,
} from "../GameDetailsUtils";
import { SalesChartTooltip } from "../SalesChartTooltip";

interface SalesTabProps {
  game: GameData;
}

export const SalesTab = ({ game }: SalesTabProps) => {
  const hasData = hasSalesData(game);
  const { totalSales, salesData, pieChartData } = prepareSalesData(game);

  if (!hasData) {
    return (
      <motion.div
        key="sales-tab"
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full"
      >
        <motion.div
          variants={contentVariants}
          custom={0}
          className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-xl"
        >
          <svg
            className="w-16 h-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Data Unavailable
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            No sales information has been recorded for this title yet.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="sales-tab"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column - Sales Charts */}
        <div className="space-y-4">
          {/* Total Global Sales */}
          <motion.div
            variants={contentVariants}
            custom={0}
            className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl"
          >
            <div>
              <div className="text-sm opacity-90">Total Global Sales</div>
              <div className="text-2xl font-bold">{totalSales.toFixed(2)}M</div>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            variants={contentVariants}
            custom={1}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white">
              Regional Distribution
            </h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="70%"
                    paddingAngle={2}
                    strokeWidth={1}
                    stroke="#ffffff"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={salesData[index % salesData.length].color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<SalesChartTooltip totalSales={totalSales} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Sales Breakdown */}
        <div className="space-y-4">
          {/* Sales Breakdown Table */}
          <motion.div
            variants={contentVariants}
            custom={2}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-[calc(100%-44px)]"
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
              Sales Breakdown
            </h3>
            <div className="space-y-3">
              {salesData.map((data, index) => (
                <div key={data.region} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {data.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {((data.sales / totalSales) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {data.sales.toFixed(2)}M
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(data.sales / totalSales) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: data.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Last updated info */}
          {shouldShowLastUpdate(game) && (
            <motion.div
              variants={contentVariants}
              custom={3}
              className="pr-1 text-xs text-right text-gray-500 dark:text-gray-400"
            >
              Last Updated: {formatReleaseDate(game.lastUpdate)}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
