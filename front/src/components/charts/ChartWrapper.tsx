import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

export const ChartWrapper = ({
  title,
  children,
  onClick,
}: ChartWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {title}
      </h3>
      {children}
    </motion.div>
  );
};
