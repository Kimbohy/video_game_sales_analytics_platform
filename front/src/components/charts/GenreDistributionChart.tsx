import { VideoGame } from "../../api/gameService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { useMemo } from "react";

interface GenreDistributionChartProps {
  games: VideoGame[];
  onSliceClick?: (genre: string) => void;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

export const GenreDistributionChart = ({
  games,
  onSliceClick,
}: GenreDistributionChartProps) => {
  const data = useMemo(() => {
    const genreSales = games.reduce((acc, game) => {
      const genre = game.genre;
      if (!acc[genre]) {
        acc[genre] = {
          name: genre,
          value: 0,
        };
      }
      acc[genre].value += game.global_Sales;
      return acc;
    }, {} as Record<string, { name: string; value: number }>);

    return Object.values(genreSales)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Show top 8 genres
  }, [games]);

  return (
    <ChartWrapper title="Genre Distribution">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              onClick={(entry) => onSliceClick?.(entry.name)}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
