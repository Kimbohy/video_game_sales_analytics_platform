import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "../../api/gameService";
import { SalesDistributionChart } from "../charts/SalesDistributionChart";
import { GenreDistributionChart } from "../charts/GenreDistributionChart";
import { TimelineChart } from "../charts/TimelineChart";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: topGames = [] } = useQuery({
    queryKey: ["topGames"],
    queryFn: () => gameService.getTopGames(100),
  });

  const { data: platformGames = [] } = useQuery({
    queryKey: ["platformGames", selectedPlatform],
    queryFn: () =>
      selectedPlatform
        ? gameService.getGamesByPlatform(selectedPlatform)
        : Promise.resolve([]),
    enabled: !!selectedPlatform,
  });

  const { data: genreGames = [] } = useQuery({
    queryKey: ["genreGames", selectedGenre],
    queryFn: () =>
      selectedGenre
        ? gameService.getGamesByGenre(selectedGenre)
        : Promise.resolve([]),
    enabled: !!selectedGenre,
  });

  const { data: yearGames = [] } = useQuery({
    queryKey: ["yearGames", selectedYear],
    queryFn: () =>
      selectedYear
        ? gameService.getGamesByYear(selectedYear)
        : Promise.resolve([]),
    enabled: !!selectedYear,
  });

  const handleReset = () => {
    setSelectedPlatform(null);
    setSelectedGenre(null);
    setSelectedYear(null);
  };

  const displayGames = selectedPlatform
    ? platformGames
    : selectedGenre
    ? genreGames
    : selectedYear
    ? yearGames
    : topGames;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video Games Sales Analytics
          </h1>
          {(selectedPlatform || selectedGenre || selectedYear) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div layout className="col-span-1 md:col-span-2">
              <TimelineChart
                games={displayGames}
                onYearClick={(year) => setSelectedYear(year)}
              />
            </motion.div>

            <motion.div layout>
              <SalesDistributionChart
                games={displayGames}
                onBarClick={(platform) => setSelectedPlatform(platform)}
              />
            </motion.div>

            <motion.div layout>
              <GenreDistributionChart
                games={displayGames}
                onSliceClick={(genre) => setSelectedGenre(genre)}
              />
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};
