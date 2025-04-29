import { motion } from "framer-motion";
import {
  contentVariants,
  formatReleaseDate,
  getCriticScoreColor,
  hasSalesData,
  shouldShowLastUpdate,
  tabVariants,
} from "../GameDetailsUtils";
import { GameData } from "../../../api/gameService";

interface OverviewTabProps {
  game: GameData;
}

export const OverviewTab = ({ game }: OverviewTabProps) => {
  return (
    <motion.div
      key="overview-tab"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4">
        {[
          { label: "Console", value: game.console },
          { label: "Genre", value: game.genre },
          { label: "Publisher", value: game.publisher },
          { label: "Developer", value: game.developer },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            variants={contentVariants}
            custom={index}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              {item.label}
            </div>
            <div className="overflow-hidden text-sm font-semibold text-gray-900 dark:text-white text-ellipsis">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Critic Score */}
      {game.criticScore !== null &&
        game.criticScore !== undefined &&
        game.criticScore !== 0 && (
          <motion.div
            variants={contentVariants}
            custom={4}
            className="p-4 mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Critic Score
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-xl font-bold ${getCriticScoreColor(
                  game.criticScore
                )}`}
              >
                {game.criticScore}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {game.criticScore >= 8
                  ? "Excellent - Critics highly recommend this game"
                  : game.criticScore >= 6
                  ? "Good - Positive reception with some minor issues"
                  : "Mixed - Has significant issues according to critics"}
              </p>
            </div>
          </motion.div>
        )}

      {/* Global Sales Summary */}
      {hasSalesData(game) && (
        <motion.div
          variants={contentVariants}
          custom={5}
          className="p-4 text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl"
        >
          <div className="text-base opacity-90">Total Global Sales</div>
          <div className="text-2xl font-bold">
            {game.totalSales.toFixed(2)}M
          </div>
          {shouldShowLastUpdate(game) && (
            <div className="mt-2 text-xs opacity-75">
              Last Updated: {formatReleaseDate(game.lastUpdate)}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
