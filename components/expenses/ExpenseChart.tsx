"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_CATEGORIES, getLabel } from "@/lib/types";

const COLORS = [
  "#22c55e", // food - green
  "#ef4444", // vet - red
  "#a855f7", // grooming - purple
  "#3b82f6", // supplies - blue
  "#f97316", // medication - orange
  "#eab308", // training - yellow
  "#6b7280", // other - gray
];

interface ExpenseChartProps {
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
}

export function ExpenseChart({ byCategory, byMonth }: ExpenseChartProps) {
  const pieData = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .map(([category, amount]) => ({
      name: getLabel(EXPENSE_CATEGORIES, category),
      value: amount,
      category,
    }))
    .sort((a, b) => b.value - a.value);

  // Last 6 months for bar chart
  const sortedMonths = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, amount]) => ({ month, amount }));

  if (pieData.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">花費分類比例</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[Object.keys(byCategory).indexOf(entry.category) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`NT$ ${Number(value).toLocaleString()}`, ""]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {sortedMonths.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">每月花費趨勢</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sortedMonths} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`NT$ ${Number(value).toLocaleString()}`, "花費"]}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
