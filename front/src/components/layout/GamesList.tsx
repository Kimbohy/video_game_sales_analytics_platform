import { VideoGame } from "../../api/gameService";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface GamesListProps {
  games: VideoGame[];
  year: number | null;
  selectedPlatform: string | null;
  selectedGenre: string | null;
  onPlatformClick: (platform: string) => void;
  onGenreClick: (genre: string) => void;
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
}: GamesListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("global_Sales");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const gamesPerPage = 12;

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        game =>
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
        comparison = a[sortField] - b[sortField];
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [games, search, sortField, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedGames.length / gamesPerPage);
  const currentGames = filteredAndSortedGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
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
          rangeWithDots.push('...');
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

  if (!year || !games.length) return null;

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`text-sm font-medium ${
        sortField === field
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {label}
      {sortField === field && (
        <span className="ml-1">
          {sortOrder === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Games Released in {year}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {currentGames.length} of {filteredAndSortedGames.length} games
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
            <div className="flex gap-4">
              <SortButton field="name" label="Name" />
              <SortButton field="global_Sales" label="Sales" />
              <SortButton field="platform" label="Platform" />
              <SortButton field="genre" label="Genre" />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedPlatform || selectedGenre || search) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active filters:
            </span>
            {selectedPlatform && (
              <span className="px-2 py-1 text-sm rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Platform: {selectedPlatform}
              </span>
            )}
            {selectedGenre && (
              <span className="px-2 py-1 text-sm rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Genre: {selectedGenre}
              </span>
            )}
            {search && (
              <span className="px-2 py-1 text-sm rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Search: "{search}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentGames.map((game) => (
          <div
            key={`${game.name}-${game.platform}`}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-shadow hover:shadow-md"
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

      {/* Improved Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                {page}
              </span>
            )
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};
