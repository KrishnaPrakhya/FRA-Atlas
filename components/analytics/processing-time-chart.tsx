"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const data = [
  { month: "Jan", avgDays: 22, target: 20, efficiency: 91 },
  { month: "Feb", avgDays: 21, target: 20, efficiency: 95 },
  { month: "Mar", avgDays: 19, target: 20, efficiency: 105 },
  { month: "Apr", avgDays: 18, target: 20, efficiency: 80 },
  { month: "May", avgDays: 20, target: 20, efficiency: 100 },
  { month: "Jun", avgDays: 17, target: 20, efficiency: 118 },
  { month: "Jul", avgDays: 19, target: 20, efficiency: 105 },
  { month: "Aug", avgDays: 16, target: 20, efficiency: 125 },
  { month: "Sep", avgDays: 18, target: 20, efficiency: 111 },
  { month: "Oct", avgDays: 15, target: 20, efficiency: 133 },
  { month: "Nov", avgDays: 17, target: 20, efficiency: 118 },
  { month: "Dec", avgDays: 18, target: 20, efficiency: 111 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{`Month: ${label}`}</p>
        <p className="text-sm text-blue-600">
          Average Days: {payload[0]?.value}
        </p>
        <p className="text-sm text-gray-500">
          Target: {payload[1]?.value} days
        </p>
        <p className="text-sm text-green-600">
          Efficiency: {payload[0]?.payload?.efficiency}%
        </p>
      </div>
    );
  }
  return null;
};

export function ProcessingTimeChart() {
  const currentAvg = data[data.length - 1].avgDays;
  const target = 20;
  const isOnTarget = currentAvg <= target;

  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <span>Processing Time Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Average processing time vs target performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isOnTarget ? "default" : "destructive"}>
              Current: {currentAvg} days
            </Badge>
            <Badge variant="outline">Target: {target} days</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorAvgDays" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Target area */}
            <Area
              type="monotone"
              dataKey="target"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorTarget)"
              name="Target"
            />

            {/* Actual processing time */}
            <Area
              type="monotone"
              dataKey="avgDays"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorAvgDays)"
              name="Average Days"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{currentAvg}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Current Avg (Days)
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{80}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Efficiency Rate
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                data.reduce((sum, item) => sum + item.avgDays, 0) / data.length
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Yearly Average
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
