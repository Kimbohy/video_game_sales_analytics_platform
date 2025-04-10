import { VideoGame } from "../../api/gameService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { useMemo } from "react";

interface TimelineChartProps {
  games: VideoGame[];
  onYearClick?: (year: number) => void;
}

export const TimelineChart = ({ games, onYearClick }: TimelineChartProps) => {
  const data = useMemo(() => {
    const yearSales = games.reduce((acc, game) => {
      if (!game.year) return acc;

      if (!acc[game.year]) {
        acc[game.year] = {
          year: game.year,
          globalSales: 0,
          gameCount: 0,
        };
      }
      acc[game.year].globalSales += game.global_Sales;
      acc[game.year].gameCount += 1;
      return acc;
    }, {} as Record<number, { year: number; globalSales: number; gameCount: number }>);

    return Object.values(yearSales)
      .sort((a, b) => a.year - b.year)
      .filter((year) => year.year >= 1980); // Filter out very old data
  }, [games]);

  return (
    <ChartWrapper title="Sales Timeline">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              onClick={(data) => data && onYearClick?.(data.year)}
              style={{ cursor: "pointer" }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="globalSales"
              stroke="#8884d8"
              name="Global Sales"
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="gameCount"
              stroke="#82ca9d"
              name="Number of Games"
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
