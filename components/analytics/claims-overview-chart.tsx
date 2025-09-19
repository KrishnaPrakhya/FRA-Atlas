"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const data = [
  { month: "Jan", submitted: 120, approved: 85, rejected: 25, pending: 10 },
  { month: "Feb", submitted: 135, approved: 95, rejected: 30, pending: 10 },
  { month: "Mar", submitted: 148, approved: 110, rejected: 28, pending: 10 },
  { month: "Apr", submitted: 162, approved: 125, rejected: 22, pending: 15 },
  { month: "May", submitted: 155, approved: 118, rejected: 27, pending: 10 },
  { month: "Jun", submitted: 178, approved: 135, rejected: 33, pending: 10 },
  { month: "Jul", submitted: 165, approved: 128, rejected: 25, pending: 12 },
  { month: "Aug", submitted: 185, approved: 142, rejected: 31, pending: 12 },
  { month: "Sep", submitted: 172, approved: 134, rejected: 28, pending: 10 },
  { month: "Oct", submitted: 195, approved: 148, rejected: 35, pending: 12 },
  { month: "Nov", submitted: 188, approved: 145, rejected: 33, pending: 10 },
  { month: "Dec", submitted: 205, approved: 158, rejected: 37, pending: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{`Month: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ClaimsOverviewChart() {
  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <span>Claims Overview</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monthly breakdown of claim submissions and outcomes
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Bar
              dataKey="submitted"
              name="Submitted"
              fill="#3b82f6"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Bar
              dataKey="approved"
              name="Approved"
              fill="#10b981"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Bar
              dataKey="rejected"
              name="Rejected"
              fill="#ef4444"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill="#f59e0b"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
