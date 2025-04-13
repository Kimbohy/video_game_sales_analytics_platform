import { VideoGame } from "../../api/gameService";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { GameDetailsModal } from "../modals/GameDetailsModal";

interface GamesListProps {
  games: VideoGame[];
  year: number | null;
  selectedPlatform: string | null;
  selectedGenre: string | null;
  onPlatformClick: (platform: string) => void;
  onGenreClick: (genre: string) => void;
  isLoading?: boolean;
}

type SortField = "name" | "platform" | "genre" | "publisher" | "global_Sales";
type SortOrder = "asc" | "desc";

export const GamesList = ({
  games,
  year,
  selectedPlatform,
  selectedGenre,
  onPlatformClick,
  onGenreClick,
  isLoading = false,
}: GamesListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("global_Sales");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedGame, setSelectedGame] = useState<VideoGame | null>(null);
  const gamesPerPage = 12;

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (game) =>
          game.name.toLowerCase().includes(searchLower) ||
          game.platform.toLowerCase().includes(searchLower) ||
          game.genre.toLowerCase().includes(searchLower) ||
          game.publisher.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "global_Sales") {
        comparison = b[sortField] - a[sortField];
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [games, search, sortField, sortOrder]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedPlatform, selectedGenre]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedGames.length / gamesPerPage);
  const currentGames = filteredAndSortedGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l;

    range.push(1);

    if (totalPages <= 1) return range;

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  if (!year) return null;

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
        sortField === field
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {label}
      {sortField === field && (
        <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  const LoadingGameCard = () => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="col-span-1 p-6 bg-white rounded-lg shadow-lg md:col-span-2 dark:bg-gray-800"
      >
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Games Released in {year}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <span className="animate-pulse">Loading games...</span>
              ) : (
                `Showing ${currentGames.length} of ${filteredAndSortedGames.length} games`
              )}
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games, platforms, genres..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Sort by:
              </span>
              <div className="flex flex-wrap gap-2">
                <SortButton field="name" label="Name" />
                <SortButton field="global_Sales" label="Sales" />
                <SortButton field="platform" label="Platform" />
                <SortButton field="genre" label="Genre" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedPlatform || selectedGenre || search) && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Active filters:
              </span>
              {selectedPlatform && (
                <span className="inline-flex items-center px-2 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg">
                  Platform: {selectedPlatform}
                  <button
                    onClick={() => onPlatformClick(selectedPlatform)}
                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center px-2 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg">
                  Genre: {selectedGenre}
                  <button
                    onClick={() => onGenreClick(selectedGenre)}
                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center px-2 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg">
                  Search: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <LoadingGameCard key={i} />)
            : currentGames.map((game) => (
                <motion.div
                  key={`${game.name}-${game.platform}`}
                  className="p-4 transition-all bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md hover:bg-white dark:hover:bg-gray-600"
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {game.name}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlatformClick(game.platform);
                          }}
                          className={`inline-flex items-center px-2 py-1 text-sm rounded-lg transition-colors ${
                            selectedPlatform === game.platform
                              ? "bg-indigo-600 text-white"
                              : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {game.platform}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenreClick(game.genre);
                          }}
                          className={`inline-flex items-center px-2 py-1 text-sm rounded-lg transition-colors ${
                            selectedGenre === game.genre
                              ? "bg-indigo-600 text-white"
                              : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {game.genre}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {game.publisher}
                      </p>
                      <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        {game.global_Sales}M Sales
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-gray-700 transition-colors bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span
                    key={index}
                    className="px-2 text-gray-500 dark:text-gray-400"
                  >
                    {page}
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-gray-700 transition-colors bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      <GameDetailsModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </>
  );
};
