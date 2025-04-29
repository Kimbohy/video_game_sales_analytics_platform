import { GameData } from "../../api/gameService";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { GameDetailsModal } from "../modals/GameDetailsModal";

interface GamesListProps {
  games: GameData[];
  year: number | null;
  selectedConsole: string | null;
  selectedGenre: string | null;
  onConsoleClick: (console: string) => void;
  onGenreClick: (genre: string) => void;
  onBackClick: () => void;
  isLoading?: boolean;
  className?: string;
}

type SortField =
  | "title"
  | "console"
  | "genre"
  | "publisher"
  | "developer"
  | "criticScore"
  | "totalSales";
type SortOrder = "asc" | "desc";

export const GamesList = ({
  games,
  year,
  selectedConsole,
  selectedGenre,
  onConsoleClick,
  onGenreClick,
  onBackClick,
  isLoading = false,
  className,
}: GamesListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("totalSales");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const gamesPerPage = 12;

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(searchLower) ||
          game.console.toLowerCase().includes(searchLower) ||
          game.genre.toLowerCase().includes(searchLower) ||
          game.publisher.toLowerCase().includes(searchLower) ||
          game.developer.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "totalSales" || sortField === "criticScore") {
        // For numeric fields
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;
        comparison = bValue - aValue;
      } else {
        // For string fields
        const aValue = String(a[sortField] || "");
        const bValue = String(b[sortField] || "");
        comparison = aValue.localeCompare(bValue);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [games, search, sortField, sortOrder]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedConsole, selectedGenre]);

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
      setSortOrder("asc");
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
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse">
      <div className="w-3/4 h-6 mb-4 bg-gray-200 rounded dark:bg-gray-600"></div>
      <div className="space-y-2">
        <div className="w-1/2 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
        <div className="w-1/3 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
      </div>
    </div>
  );

  const formatReleaseDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`col-span-1 p-6 bg-white rounded-lg shadow-lg md:col-span-2 dark:bg-gray-800 ${
          className || ""
        }`}
      >
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackClick}
                className="p-2 text-gray-600 rounded-full hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Games Released in {year}
              </h2>
            </div>
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
                  placeholder="Search games, consoles, genres, developers..."
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
                <SortButton field="title" label="Title" />
                <SortButton field="totalSales" label="Sales" />
                <SortButton field="criticScore" label="Score" />
                <SortButton field="console" label="Console" />
                <SortButton field="genre" label="Genre" />
                <SortButton field="developer" label="Developer" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedConsole || selectedGenre || search) && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 active-filters">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Active filters:
              </span>
              {selectedConsole && (
                <span className="inline-flex items-center px-2 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-lg dark:bg-indigo-900 dark:text-indigo-200">
                  Console: {selectedConsole}
                  <button
                    onClick={() => onConsoleClick(selectedConsole)}
                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center px-2 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-lg dark:bg-indigo-900 dark:text-indigo-200">
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
                <span className="inline-flex items-center px-2 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-lg dark:bg-indigo-900 dark:text-indigo-200">
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
                  key={`${game.title}-${game.console}`}
                  className="p-4 transition-all rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:shadow-md hover:bg-white dark:hover:bg-gray-600"
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-3">
                      {game.img && (
                        <div className="flex-shrink-0">
                          <img
                            src={game.img}
                            alt={game.title}
                            className="object-cover w-16 h-16 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {game.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Released: {formatReleaseDate(game.releaseDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConsoleClick(game.console);
                          }}
                          className={`inline-flex items-center px-2 py-1 text-sm rounded-lg transition-colors ${
                            selectedConsole === game.console
                              ? "bg-indigo-600 text-white"
                              : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {game.console}
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
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {game.developer !== game.publisher ? (
                              <>Dev: {game.developer}</>
                            ) : (
                              <>Publisher: {game.publisher}</>
                            )}
                          </p>
                        </div>
                        <div>
                          {game.criticScore ? (
                            <span
                              className={`px-2 py-1 text-sm rounded ${
                                game.criticScore >= 8
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : game.criticScore >= 6
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              Score: {game.criticScore}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        {game.totalSales > 0 ||
                        game.naSales > 0 ||
                        game.palSales > 0 ||
                        game.jpSales > 0 ||
                        game.otherSales > 0
                          ? `${game.totalSales}M Sales`
                          : "Sales data not available"}
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
