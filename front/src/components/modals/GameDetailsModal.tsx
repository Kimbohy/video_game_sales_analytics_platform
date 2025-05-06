import { GameData } from "../../api/gameService";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scrollLockManager } from "./ScrollLockManager";
import {
  backdropVariants,
  contentVariants,
  formatReleaseDate,
  getFullImageUrl,
  modalVariants,
} from "./GameDetailsUtils";
import { DetailsTab, OverviewTab, SalesTab } from "./tabs";

interface GameDetailsModalProps {
  game: GameData | null;
  onClose: () => void;
}

type TabType = "overview" | "sales" | "details";

export const GameDetailsModal = ({ game, onClose }: GameDetailsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // If clicked outside modal content, close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Enhance the close functionality to ensure scroll is restored
  const handleClose = () => {
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
          style={{ maxHeight: "85vh" }}
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

          {/* Content Area - Scrollable with auto height */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <OverviewTab game={game} key="overview" />
              )}
              {activeTab === "sales" && <SalesTab game={game} key="sales" />}
              {activeTab === "details" && (
                <DetailsTab game={game} key="details" />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
