import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "../api/gameService";
import { SalesDistributionChart } from "../components/charts/SalesDistributionChart";
import { GenreDistributionChart } from "../components/charts/GenreDistributionChart";
import { TimelineChart } from "../components/charts/TimelineChart";
import { GamesList } from "../components/layout/GamesList";
import { UserGuide } from "../components/layout/UserGuide";
import { motion, AnimatePresence } from "framer-motion";

export const SalesAnalysis = () => {
  const [selectedConsole, setSelectedConsole] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get filtered data based on current filters
  const { data: filteredData, isLoading: isFilteredDataLoading } = useQuery({
    queryKey: ["filteredData", selectedConsole, selectedGenre, selectedYear],
    queryFn: () =>
      gameService.getFilteredData({
        console: selectedConsole || undefined,
        genre: selectedGenre || undefined,
        year: selectedYear || undefined,
      }),
  });

  // Get filtered games based on all filters
  const { data: filteredGames, isLoading: isGamesLoading } = useQuery({
    queryKey: ["filteredGames", selectedConsole, selectedGenre, selectedYear],
    queryFn: () =>
      gameService.getFilteredGames({
        console: selectedConsole || undefined,
        genre: selectedGenre || undefined,
        year: selectedYear || undefined,
      }),
    enabled: !!selectedYear,
  });

  const handleReset = () => {
    setSelectedConsole(null);
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  if (isFilteredDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading analytics data...
          </p>
        </motion.div>
      </div>
    );
  }

  if (
    !filteredData ||
    (!filteredData.timelineData.length && !filteredData.platformSales.length)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="p-8 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            No Data Available
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            There is no data available for the selected filters.
          </p>
          {(selectedConsole || selectedGenre || selectedYear) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Reset Filters
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <UserGuide showGamesListOnly={!!selectedYear} />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Video Games Sales Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {selectedYear
                ? `Viewing data for ${selectedYear}`
                : "Select a year from the timeline to view detailed data"}
              {selectedConsole ? ` • Console: ${selectedConsole}` : ""}
              {selectedGenre ? ` • Genre: ${selectedGenre}` : ""}
            </p>
          </div>
          {(selectedConsole || selectedGenre || selectedYear) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Reset Filters
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence>
              {!selectedYear && (
                <motion.div
                  layout
                  className="col-span-1 md:col-span-2 timeline-chart"
                >
                  <TimelineChart
                    data={filteredData?.timelineData ?? []}
                    onYearClick={(year) =>
                      setSelectedYear(year === selectedYear ? null : year)
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedYear && (
                <GamesList
                  year={selectedYear}
                  games={filteredGames ?? []}
                  selectedConsole={selectedConsole}
                  selectedGenre={selectedGenre}
                  onConsoleClick={(console) =>
                    setSelectedConsole(
                      console === selectedConsole ? null : console
                    )
                  }
                  onGenreClick={(genre) =>
                    setSelectedGenre(genre === selectedGenre ? null : genre)
                  }
                  onBackClick={() => setSelectedYear(null)}
                  isLoading={isGamesLoading}
                  className="games-list"
                />
              )}
            </AnimatePresence>

            <motion.div layout className="h-full platform-chart">
              <SalesDistributionChart
                data={filteredData?.platformSales ?? []}
                onBarClick={(platform) =>
                  setSelectedConsole(
                    platform === selectedConsole ? null : platform
                  )
                }
              />
            </motion.div>

            <motion.div layout className="h-full genre-chart">
              <GenreDistributionChart
                data={filteredData?.genreData ?? []}
                onSliceClick={(genre) =>
                  setSelectedGenre(genre === selectedGenre ? null : genre)
                }
              />
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};
