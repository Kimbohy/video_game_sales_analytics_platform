import { GameData } from "../../api/gameService";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useRef, useState } from "react";

interface GameDetailsModalProps {
  game: GameData | null;
  onClose: () => void;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
const VGCHARTZ_BASE_URL = "https://www.vgchartz.com";

type TabType = "overview" | "sales" | "details";

// Scroll lock manager
const scrollLockManager = {
  originalStyle: "",
  lockCount: 0,

  // Lock the scroll - but don't actually lock it
  lock: () => {
    // We're intentionally not locking scroll
    // This prevents the body from becoming unscrollable
    scrollLockManager.lockCount++;
  },

  // Unlock the scroll
  unlock: () => {
    if (scrollLockManager.lockCount > 0) {
      scrollLockManager.lockCount--;
    }
  },

  // Force unlock all (emergency reset)
  forceUnlock: () => {
    scrollLockManager.lockCount = 0;
    // Ensure body overflow is restored
    document.body.style.overflow = "auto";
  },
};

export const GameDetailsModal = ({ game, onClose }: GameDetailsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // If clicked outside modal content, close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Enhance the close functionality to ensure scroll is restored
  const handleClose = () => {
    setIsExiting(true);
    // Immediately unlock scroll to ensure it's restored
    scrollLockManager.forceUnlock();
    // Small delay before actually closing to let animation play
    setTimeout(() => {
      onClose();
    }, 300); // Match this with exit animation duration
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  // Handle escape key to close modal and manage scroll lock
  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);

    // We'll track the modal opening but not actually lock scroll
    scrollLockManager.lock();

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      // Ensure scroll is restored when component unmounts
      scrollLockManager.forceUnlock();
    };
  }, []);

  // Additional protection to ensure scroll is always restored
  useEffect(() => {
    return () => {
      // Guaranteed scroll restoration on component unmount
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 100);
    };
  }, []);

  if (!game) return null;

  const formatReleaseDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";

    // Check if the date is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to determine if we should show the last update date
  const shouldShowLastUpdate = () => {
    // If there's no last update or it's unknown, don't show it
    if (!game.lastUpdate || formatReleaseDate(game.lastUpdate) === "Unknown") {
      return false;
    }

    // If release date is unknown, show the last update
    if (
      !game.releaseDate ||
      formatReleaseDate(game.releaseDate) === "Unknown"
    ) {
      return true;
    }

    // Compare dates - when the release date is after the last update date, don't show the last update
    const releaseDate = new Date(game.releaseDate);
    const updateDate = new Date(game.lastUpdate);

    return !(releaseDate > updateDate);
  };

  const getCriticScoreColor = (score: number | null) => {
    if (score === null || score === undefined || score === 0)
      return "bg-gray-200 dark:bg-gray-600";
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFullImageUrl = (imgPath: string | null) => {
    if (!imgPath) return null;
    // Check if the URL already begins with http:// or https://
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
      return imgPath;
    }
    // Make sure the path starts with a slash
    const path = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
    return `${VGCHARTZ_BASE_URL}${path}`;
  };

  // Check if all sales data is zero
  const hasSalesData =
    game.totalSales > 0 ||
    game.naSales > 0 ||
    game.palSales > 0 ||
    game.jpSales > 0 ||
    game.otherSales > 0;

  const totalSales = game.totalSales;
  const salesData = [
    { region: "North America", sales: game.naSales, color: COLORS[0] },
    { region: "Europe/PAL", sales: game.palSales, color: COLORS[1] },
    { region: "Japan", sales: game.jpSales, color: COLORS[2] },
    { region: "Other", sales: game.otherSales, color: COLORS[3] },
  ].sort((a, b) => b.sales - a.sales);

  const pieChartData = salesData.map((item) => ({
    name: item.region,
    value: item.sales,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.value.toFixed(2)}M (
            {((data.value / totalSales) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
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
            {hasSalesData && (
              <motion.div
                variants={contentVariants}
                custom={5}
                className="p-4 text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl"
              >
                <div className="text-base opacity-90">Total Global Sales</div>
                <div className="text-2xl font-bold">
                  {totalSales.toFixed(2)}M
                </div>
                {shouldShowLastUpdate() && (
                  <div className="mt-2 text-xs opacity-75">
                    Last Updated: {formatReleaseDate(game.lastUpdate)}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      case "sales":
        return (
          <motion.div
            key="sales-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            {hasSalesData ? (
              <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
                {/* Left Column - Sales Charts */}
                <div className="space-y-4">
                  {/* Total Global Sales */}
                  <motion.div
                    variants={contentVariants}
                    custom={0}
                    className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl"
                  >
                    <div>
                      <div className="text-sm opacity-90">
                        Total Global Sales
                      </div>
                      <div className="text-2xl font-bold">
                        {totalSales.toFixed(2)}M
                      </div>
                    </div>
                    {/* <div className="p-2 rounded-full bg-white/20">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4V20M18 10L12 4L6 10M6 20H18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div> */}
                  </motion.div>

                  {/* Pie Chart */}
                  <motion.div
                    variants={contentVariants}
                    custom={1}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white">
                      Regional Distribution
                    </h3>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="45%"
                            outerRadius="70%"
                            paddingAngle={2}
                            strokeWidth={1}
                            stroke="#ffffff"
                          >
                            {pieChartData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Sales Breakdown */}
                <div className="space-y-4">
                  {/* Sales Breakdown Table */}
                  <motion.div
                    variants={contentVariants}
                    custom={2}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-[calc(100%-44px)]"
                  >
                    <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
                      Sales Breakdown
                    </h3>
                    <div className="space-y-3">
                      {salesData.map((data, index) => (
                        <div key={data.region} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                {data.region}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {((data.sales / totalSales) * 100).toFixed(1)}%
                              </span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                {data.sales.toFixed(2)}M
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(data.sales / totalSales) * 100}%`,
                              }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Last updated info */}
                  {shouldShowLastUpdate() && (
                    <motion.div
                      variants={contentVariants}
                      custom={3}
                      className="pr-1 text-xs text-right text-gray-500 dark:text-gray-400"
                    >
                      Last Updated: {formatReleaseDate(game.lastUpdate)}
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                variants={contentVariants}
                custom={0}
                className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <svg
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sales Data Unavailable
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  No sales information has been recorded for this title yet.
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      case "details":
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
                    <span className="text-gray-500 dark:text-gray-400">
                      Genre:
                    </span>
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
              {shouldShowLastUpdate() && (
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
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm bg-black/70"
      >
        <motion.div
          ref={modalRef}
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-3xl overflow-hidden bg-white shadow-2xl dark:bg-gray-800 rounded-2xl"
          style={{ height: "min(85vh, 600px)" }}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute z-10 p-2 rounded-full top-3 right-3 text-white/80 hover:text-white bg-black/30"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          {/* Header with gradient and game image */}
          <motion.div
            variants={contentVariants}
            custom={0}
            className="relative p-4 bg-gradient-to-br from-indigo-600 to-purple-600"
          >
            <div className="flex items-center gap-4">
              {game.img && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="overflow-hidden rounded-lg shadow-xl shrink-0"
                >
                  <img
                    src={getFullImageUrl(game.img) ?? undefined}
                    alt={game.title}
                    className="object-cover w-16 h-16 sm:w-20 sm:h-20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </motion.div>
              )}
              <div>
                <motion.h2
                  variants={contentVariants}
                  custom={1}
                  className="max-w-full text-xl font-bold text-white truncate sm:text-2xl"
                >
                  {game.title}
                </motion.h2>
                <motion.p
                  variants={contentVariants}
                  custom={2}
                  className="text-xs text-white/80 sm:text-sm"
                >
                  Released: {formatReleaseDate(game.releaseDate)}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex px-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview" },
              { id: "sales", label: "Sales" },
              { id: "details", label: "Details" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 text-sm font-medium relative transition-colors ${
                  activeTab === tab.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area - Fixed height with scrolling */}
          <div className="p-4 h-[calc(100%-120px)] overflow-y-auto">
            <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
