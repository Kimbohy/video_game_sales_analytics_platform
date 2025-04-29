import { COLORS } from "./GameDetailsUtils";

interface SalesChartTooltipProps {
  active?: boolean;
  payload?: any[];
  totalSales: number;
}

export const SalesChartTooltip = ({
  active,
  payload,
  totalSales,
}: SalesChartTooltipProps) => {
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
