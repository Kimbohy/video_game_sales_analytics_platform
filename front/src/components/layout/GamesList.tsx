import { VideoGame } from "../../api/gameService";
import { motion } from "framer-motion";

interface GamesListProps {
  games: VideoGame[];
  year: number | null;
  selectedPlatform: string | null;
  selectedGenre: string | null;
  onPlatformClick: (platform: string) => void;
  onGenreClick: (genre: string) => void;
}

export const GamesList = ({
  games,
  year,
  selectedPlatform,
  selectedGenre,
  onPlatformClick,
  onGenreClick,
}: GamesListProps) => {
  if (!year || !games.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Games Released in {year}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={`${game.name}-${game.platform}`}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {game.name}
              </h3>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <button
                  onClick={() => onPlatformClick(game.platform)}
                  className={`inline-block px-2 py-1 rounded ${
                    selectedPlatform === game.platform
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {game.platform}
                </button>
                <button
                  onClick={() => onGenreClick(game.genre)}
                  className={`inline-block px-2 py-1 rounded ml-2 ${
                    selectedGenre === game.genre
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {game.genre}
                </button>
                <p>Publisher: {game.publisher}</p>
              </div>
              <div className="mt-auto pt-2">
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {game.global_Sales}M Global Sales
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
