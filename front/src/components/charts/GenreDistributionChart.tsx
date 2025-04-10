import { GenreSales } from "../../api/gameService";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartWrapper } from "./ChartWrapper";

interface GenreDistributionChartProps {
  data: GenreSales[];
  onSliceClick?: (genre: string) => void;
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
];

export const GenreDistributionChart = ({
  data,
  onSliceClick,
}: GenreDistributionChartProps) => {
  return (
    <ChartWrapper title="Genre Distribution">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalSales"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              onClick={(data) => onSliceClick?.(data.genre)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
