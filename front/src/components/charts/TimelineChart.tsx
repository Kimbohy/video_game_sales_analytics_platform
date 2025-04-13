import { YearSales } from "../../api/gameService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

interface TimelineChartProps {
  data: YearSales[];
  onYearClick: (year: number) => void;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Year {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TimelineChart = ({
  data,
  onYearClick,
  isLoading = false,
}: TimelineChartProps) => {
  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const year = data.activePayload[0].payload.year;
      onYearClick(year);
    }
  };

  return (
    <ChartWrapper title="Sales Timeline" isLoading={isLoading}>
      <div className="w-full h-[400px] text-gray-600 dark:text-gray-300">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={handleClick}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.5}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="year"
              style={{ cursor: "pointer" }}
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
              label={{
                value: "Global Sales (Millions)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "currentColor" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
              label={{
                value: "Number of Games",
                angle: 90,
                position: "insideRight",
                style: { fill: "currentColor" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "currentColor" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="globalSales"
              name="Global Sales"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4, cursor: "pointer" }}
              activeDot={{
                r: 8,
                cursor: "pointer",
                fill: "#8884d8",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="gameCount"
              name="Number of Games"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4, cursor: "pointer" }}
              activeDot={{
                r: 8,
                cursor: "pointer",
                fill: "#82ca9d",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
