import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

export const ChartWrapper = ({
  title,
  children,
  onClick,
  isLoading = false,
}: ChartWrapperProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-h-[400px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading chart data...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${
        onClick ? "cursor-pointer hover:shadow-xl transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
};
