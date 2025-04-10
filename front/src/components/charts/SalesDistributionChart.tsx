import { VideoGame } from "../../api/gameService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";
import { useMemo } from "react";

interface SalesDistributionChartProps {
  games: VideoGame[];
  onBarClick?: (platform: string) => void;
}

export const SalesDistributionChart = ({
  games,
  onBarClick,
}: SalesDistributionChartProps) => {
  const data = useMemo(() => {
    const platformSales = games.reduce((acc, game) => {
      const platform = game.platform;
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          globalSales: 0,
          naSales: 0,
          euSales: 0,
          jpSales: 0,
          otherSales: 0,
        };
      }
      acc[platform].globalSales += game.global_Sales;
      acc[platform].naSales += game.na_Sales;
      acc[platform].euSales += game.eu_Sales;
      acc[platform].jpSales += game.jp_Sales;
      acc[platform].otherSales += game.other_Sales;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(platformSales).sort(
      (a, b) => b.globalSales - a.globalSales
    );
  }, [games]);

  return (
    <ChartWrapper title="Sales Distribution by Platform">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="naSales"
              name="North America"
              stackId="a"
              fill="#8884d8"
              onClick={(data) => onBarClick?.(data.platform)}
            />
            <Bar
              dataKey="euSales"
              name="Europe"
              stackId="a"
              fill="#82ca9d"
              onClick={(data) => onBarClick?.(data.platform)}
            />
            <Bar
              dataKey="jpSales"
              name="Japan"
              stackId="a"
              fill="#ffc658"
              onClick={(data) => onBarClick?.(data.platform)}
            />
            <Bar
              dataKey="otherSales"
              name="Other"
              stackId="a"
              fill="#ff7300"
              onClick={(data) => onBarClick?.(data.platform)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
