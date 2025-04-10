import { YearSales } from "../../api/gameService";
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

interface TimelineChartProps {
  data: YearSales[];
  onYearClick: (year: number) => void;
}

export const TimelineChart = ({ data, onYearClick }: TimelineChartProps) => {
  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const year = data.activePayload[0].payload.year;
      onYearClick(year);
    }
  };

  return (
    <ChartWrapper title="Sales Timeline">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} onClick={handleClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              onClick={(data) => data && onYearClick(data.year)}
              style={{ cursor: "pointer" }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="globalSales"
              stroke="#8884d8"
              name="Global Sales"
              dot={{ r: 4, cursor: "pointer" }}
              activeDot={{ r: 8, cursor: "pointer" }}
              style={{ cursor: "pointer" }}
            />
            <Line
              type="monotone"
              dataKey="gameCount"
              stroke="#82ca9d"
              name="Number of Games"
              dot={{ r: 4, cursor: "pointer" }}
              activeDot={{ r: 8, cursor: "pointer" }}
              style={{ cursor: "pointer" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};
