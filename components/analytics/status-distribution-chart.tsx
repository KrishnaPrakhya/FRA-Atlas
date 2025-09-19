"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Approved", value: 913, percentage: 73.2 },
  { name: "Rejected", value: 187, percentage: 15.0 },
  { name: "Under Review", value: 89, percentage: 7.1 },
  { name: "Pending", value: 58, percentage: 4.7 },
];

const COLORS = {
  Approved: "#10b981",
  Rejected: "#ef4444",
  "Under Review": "#f59e0b",
  Pending: "#8b5cf6",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Count: {data.value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Percentage: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percentage,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${percentage}%`}
    </text>
  );
};

export function StatusDistributionChart() {
  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
          <span>Status Distribution</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current breakdown of all claim statuses
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[item.name as keyof typeof COLORS],
                  }}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
