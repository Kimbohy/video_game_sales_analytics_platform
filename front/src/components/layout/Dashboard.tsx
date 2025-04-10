import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "../../api/gameService";
import { SalesDistributionChart } from "../charts/SalesDistributionChart";
import { GenreDistributionChart } from "../charts/GenreDistributionChart";
import { TimelineChart } from "../charts/TimelineChart";
import { GamesList } from "./GamesList";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get filtered data based on current filters
  const { data: filteredData } = useQuery({
    queryKey: ["filteredData", selectedPlatform, selectedGenre, selectedYear],
    queryFn: () =>
      gameService.getFilteredData({
        platform: selectedPlatform || undefined,
        genre: selectedGenre || undefined,
        year: selectedYear || undefined,
      }),
  });

  // Get filtered games based on all filters
  const { data: filteredGames } = useQuery({
    queryKey: ["filteredGames", selectedPlatform, selectedGenre, selectedYear],
    queryFn: () =>
      gameService.getFilteredGames({
        platform: selectedPlatform || undefined,
        genre: selectedGenre || undefined,
        year: selectedYear || undefined,
      }),
    enabled: !!selectedYear, // Only fetch when a year is selected
  });

  const handleReset = () => {
    setSelectedPlatform(null);
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video Games Sales Analytics
          </h1>
          {(selectedPlatform || selectedGenre || selectedYear) && (
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
                <motion.div layout className="col-span-1 md:col-span-2">
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
                  selectedPlatform={selectedPlatform}
                  selectedGenre={selectedGenre}
                  onPlatformClick={(platform) =>
                    setSelectedPlatform(
                      platform === selectedPlatform ? null : platform
                    )
                  }
                  onGenreClick={(genre) =>
                    setSelectedGenre(genre === selectedGenre ? null : genre)
                  }
                />
              )}
            </AnimatePresence>

            <motion.div layout>
              <SalesDistributionChart
                data={filteredData?.platformSales ?? []}
                onBarClick={(platform) =>
                  setSelectedPlatform(
                    platform === selectedPlatform ? null : platform
                  )
                }
              />
            </motion.div>

            <motion.div layout>
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
