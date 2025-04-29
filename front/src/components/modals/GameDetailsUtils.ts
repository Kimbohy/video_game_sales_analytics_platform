import { GameData } from "../../api/gameService";

// Constants
export const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
export const VGCHARTZ_BASE_URL = "https://www.vgchartz.com";

// Utility functions
export const formatReleaseDate = (dateString: string | null) => {
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
export const shouldShowLastUpdate = (game: GameData) => {
  // If there's no last update or it's unknown, don't show it
  if (!game.lastUpdate || formatReleaseDate(game.lastUpdate) === "Unknown") {
    return false;
  }

  // If release date is unknown, show the last update
  if (!game.releaseDate || formatReleaseDate(game.releaseDate) === "Unknown") {
    return true;
  }

  // Compare dates - when the release date is after the last update date, don't show the last update
  const releaseDate = new Date(game.releaseDate);
  const updateDate = new Date(game.lastUpdate);

  return !(releaseDate > updateDate);
};

export const getCriticScoreColor = (score: number | null) => {
  if (score === null || score === undefined || score === 0)
    return "bg-gray-200 dark:bg-gray-600";
  if (score >= 8) return "bg-green-500";
  if (score >= 6) return "bg-yellow-500";
  return "bg-red-500";
};

export const getFullImageUrl = (imgPath: string | null) => {
  if (!imgPath) return null;
  // Check if the URL already begins with http:// or https://
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  // Make sure the path starts with a slash
  const path = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return `${VGCHARTZ_BASE_URL}${path}`;
};

// Check if the game has any sales data
export const hasSalesData = (game: GameData) => {
  return (
    game.totalSales > 0 ||
    game.naSales > 0 ||
    game.palSales > 0 ||
    game.jpSales > 0 ||
    game.otherSales > 0
  );
};

// Animation variants
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants = {
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

export const contentVariants = {
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

export const tabVariants = {
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

// Prepare the sales data for charts
export const prepareSalesData = (game: GameData) => {
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

  return { totalSales, salesData, pieChartData };
};
