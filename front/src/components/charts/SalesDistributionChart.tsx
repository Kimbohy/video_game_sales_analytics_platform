import { PlatformSales } from "../../api/gameService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

interface SalesDistributionChartProps {
  data: PlatformSales[];
  onBarClick?: (platform: string) => void;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalSales = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-sm flex justify-between items-center gap-4"
          >
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.value.toFixed(2)}M
            </span>
          </p>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Total: {totalSales.toFixed(2)}M
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const SalesDistributionChart = ({
  data,
  onBarClick,
  isLoading = false,
}: SalesDistributionChartProps) => {
  return (
    <ChartWrapper title="Sales Distribution by Platform" isLoading={isLoading}>
      <div className="w-full h-[400px] text-gray-600 dark:text-gray-300">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.5}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="platform"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
              label={{
                value: "Platform",
                position: "insideBottom",
                offset: -5,
                style: { fill: "currentColor" },
              }}
            />
            <YAxis
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
              label={{
                value: "Sales (Millions)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "currentColor" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "currentColor" }} />
            <Bar
              dataKey="naSales"
              name="North America"
              stackId="a"
              fill="#8884d8"
              onClick={(data) => onBarClick?.(data.platform)}
              cursor="pointer"
            />
            <Bar
              dataKey="euSales"
              name="Europe"
              stackId="a"
              fill="#82ca9d"
              onClick={(data) => onBarClick?.(data.platform)}
              cursor="pointer"
            />
            <Bar
              dataKey="jpSales"
              name="Japan"
              stackId="a"
              fill="#ffc658"
              onClick={(data) => onBarClick?.(data.platform)}
              cursor="pointer"
            />
            <Bar
              dataKey="otherSales"
              name="Other"
              stackId="a"
              fill="#ff7300"
              onClick={(data) => onBarClick?.(data.platform)}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
