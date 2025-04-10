import { PlatformSales } from "../../api/gameService";
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

interface SalesDistributionChartProps {
  data: PlatformSales[];
  onBarClick?: (platform: string) => void;
}

export const SalesDistributionChart = ({
  data,
  onBarClick,
}: SalesDistributionChartProps) => {
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
