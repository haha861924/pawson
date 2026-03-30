"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface WeightRecord {
  id: string;
  weight: number;
  date: Date;
}

interface WeightChartProps {
  records: WeightRecord[];
}

export function WeightChart({ records }: WeightChartProps) {
  if (records.length === 0) return null;

  // Sort by date ascending for the chart
  const sortedData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: format(new Date(record.date), "yyyy/MM/dd"),
      weight: record.weight,
    }));

  // Calculate min and max for better Y-axis scale
  const weights = sortedData.map((d) => d.weight);
  const minWeight = Math.floor(Math.min(...weights) * 0.95);
  const maxWeight = Math.ceil(Math.max(...weights) * 1.05);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">體重趨勢圖</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              label={{ value: "體重 (kg)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value) => [`${value} kg`, "體重"]}
              labelStyle={{ color: "#000" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="體重"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
