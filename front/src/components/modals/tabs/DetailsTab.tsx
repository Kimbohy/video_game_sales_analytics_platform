import { motion } from "framer-motion";
import { GameData } from "../../../api/gameService";
import {
  contentVariants,
  formatReleaseDate,
  getCriticScoreColor,
  shouldShowLastUpdate,
  tabVariants,
} from "../GameDetailsUtils";

interface DetailsTabProps {
  game: GameData;
}

export const DetailsTab = ({ game }: DetailsTabProps) => {
  return (
    <motion.div
      key="details-tab"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Release Information */}
        <motion.div
          variants={contentVariants}
          custom={0}
          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
        >
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Release Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Release Date:
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatReleaseDate(game.releaseDate)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Platform:
              </span>
              <span className="text-gray-900 dark:text-white">
                {game.console}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Genre:</span>
              <span className="text-gray-900 dark:text-white">
                {game.genre}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Company Information */}
        <motion.div
          variants={contentVariants}
          custom={1}
          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
        >
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Company Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Developer:
              </span>
              <span className="text-gray-900 dark:text-white">
                {game.developer}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Publisher:
              </span>
              <span className="text-gray-900 dark:text-white">
                {game.publisher}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Review Score */}
        {game.criticScore !== null &&
          game.criticScore !== undefined &&
          game.criticScore !== 0 && (
            <motion.div
              variants={contentVariants}
              custom={2}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                Review Score
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-bold ${getCriticScoreColor(
                    game.criticScore
                  )}`}
                >
                  {game.criticScore}
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {game.criticScore >= 8
                      ? "Excellent"
                      : game.criticScore >= 6
                      ? "Good"
                      : "Mixed"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        {/* Last Updated */}
        {shouldShowLastUpdate(game) && (
          <motion.div
            variants={contentVariants}
            custom={3}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              Last Data Update
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatReleaseDate(game.lastUpdate)}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
