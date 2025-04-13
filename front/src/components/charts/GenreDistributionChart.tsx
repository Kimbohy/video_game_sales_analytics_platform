import { GenreSales } from "../../api/gameService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

interface GenreDistributionChartProps {
  data: GenreSales[];
  onSliceClick?: (genre: string) => void;
  isLoading?: boolean;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#EA4C89",
  "#9B51E0",
  "#FF6B6B",
  "#4ECDC4",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {data.genre}
        </p>
        <p className="text-sm flex items-center justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-300">Total Sales:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {data.totalSales.toFixed(2)}M
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload, onSliceClick }: any) => {
  return (
    <ul className="flex flex-wrap justify-center gap-2 mt-4 text-gray-600 dark:text-gray-300">
      {payload.map((entry: any, index: number) => (
        <li
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors cursor-pointer"
          style={{
            backgroundColor: `${entry.color}15`,
            color: entry.color,
          }}
          onClick={() => onSliceClick?.(entry.value)}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export const GenreDistributionChart = ({
  data,
  onSliceClick,
  isLoading = false,
}: GenreDistributionChartProps) => {
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: data.reduce((sum, d) => sum + d.totalSales, 0),
  }));

  return (
    <ChartWrapper title="Genre Distribution" isLoading={isLoading}>
      <div className="w-full h-[400px] text-gray-600 dark:text-gray-300">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithTotal}
              dataKey="totalSales"
              nameKey="genre"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={1}
              onClick={(data) => onSliceClick?.(data.genre)}
              cursor="pointer"
              label={{
                fill: "currentColor",
                fontSize: 12,
              }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend onSliceClick={onSliceClick} />}
              wrapperStyle={{ color: "currentColor" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
