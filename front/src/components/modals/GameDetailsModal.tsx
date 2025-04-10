import { VideoGame } from "../../api/gameService";
import { motion, AnimatePresence } from "framer-motion";

interface GameDetailsModalProps {
  game: VideoGame | null;
  onClose: () => void;
}

export const GameDetailsModal = ({ game, onClose }: GameDetailsModalProps) => {
  if (!game) return null;

  const totalSales = game.global_Sales;
  const salesData = [
    { region: "North America", sales: game.nA_Sales, color: "bg-blue-500" },
    { region: "Europe", sales: game.eU_Sales, color: "bg-green-500" },
    { region: "Japan", sales: game.jP_Sales, color: "bg-red-500" },
    { region: "Other", sales: game.other_Sales, color: "bg-yellow-500" },
  ];

  // Define animation variants for different elements
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20, rotateX: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -100,
      rotateX: 10,
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      x: i % 2 === 0 ? 100 : -100,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  const salesChartVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.6,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (percent: number) => ({
      width: `${percent}%`,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    }),
    exit: {
      width: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm bg-black/60"
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl dark:bg-gray-800 rounded-2xl perspective-1000"
        >
          {/* Header with gradient */}
          <motion.div
            variants={contentVariants}
            custom={0}
            className="relative h-48 p-6 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            <motion.h2
              variants={contentVariants}
              custom={1}
              className="mt-8 text-3xl font-bold text-white"
            >
              {game.name}
            </motion.h2>
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { label: "Platform", value: game.platform },
                { label: "Genre", value: game.genre },
                { label: "Year", value: game.year },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={contentVariants}
                  custom={index + 2}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Publisher Info */}
            <motion.div
              variants={contentVariants}
              custom={5}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Publisher
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {game.publisher}
              </div>
            </motion.div>

            {/* Sales Chart */}
            <motion.div variants={salesChartVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales Distribution
              </h3>
              <div className="space-y-3">
                {salesData.map((data, index) => (
                  <motion.div
                    key={data.region}
                    variants={contentVariants}
                    custom={index + 6}
                    className="space-y-1"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {data.region}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {data.sales}M
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                      <motion.div
                        variants={barVariants}
                        custom={(data.sales / totalSales) * 100}
                        className={`h-full ${data.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Global Sales Summary */}
            <motion.div
              variants={contentVariants}
              custom={10}
              className="p-6 text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl"
            >
              <div className="text-lg opacity-90">Total Global Sales</div>
              <div className="text-4xl font-bold">{game.global_Sales}M</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
