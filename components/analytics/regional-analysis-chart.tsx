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
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    state: "Jharkhand",
    claims: 285,
    approved: 215,
    rejected: 45,
    approvalRate: 75.4,
    population: 33000000,
  },
  {
    state: "Odisha",
    claims: 245,
    approved: 185,
    rejected: 35,
    approvalRate: 75.5,
    population: 42000000,
  },
  {
    state: "Chhattisgarh",
    claims: 198,
    approved: 142,
    rejected: 38,
    approvalRate: 71.7,
    population: 25000000,
  },
  {
    state: "Maharashtra",
    claims: 165,
    approved: 118,
    rejected: 28,
    approvalRate: 71.5,
    population: 112000000,
  },
  {
    state: "Madhya Pradesh",
    claims: 142,
    approved: 98,
    rejected: 25,
    approvalRate: 69.0,
    population: 72000000,
  },
  {
    state: "Andhra Pradesh",
    claims: 128,
    approved: 95,
    rejected: 22,
    approvalRate: 74.2,
    population: 49000000,
  },
  {
    state: "Telangana",
    claims: 84,
    approved: 62,
    rejected: 15,
    approvalRate: 73.8,
    population: 35000000,
  },
];

const getBarColor = (approvalRate: number) => {
  if (approvalRate >= 75) return "#10b981"; // Green
  if (approvalRate >= 70) return "#f59e0b"; // Orange
  return "#ef4444"; // Red
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[200px]">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600">Total Claims: {data.claims}</p>
          <p className="text-sm text-green-600">Approved: {data.approved}</p>
          <p className="text-sm text-red-600">Rejected: {data.rejected}</p>
          <p className="text-sm text-purple-600">
            Approval Rate: {data.approvalRate}%
          </p>
          <p className="text-sm text-gray-500">
            Population: {(data.population / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RegionalAnalysisChart() {
  const totalClaims = data.reduce((sum, item) => sum + item.claims, 0);
  const totalApproved = data.reduce((sum, item) => sum + item.approved, 0);
  const overallApprovalRate = ((totalApproved / totalClaims) * 100).toFixed(1);

  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span>Regional Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Claims distribution and approval rates by state
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Overall Rate: {overallApprovalRate}%
            </Badge>
            <Badge variant="default">Total: {totalClaims} Claims</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="state"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="claims" name="Total Claims" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.approvalRate)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer> */}

        {/* State Performance Summary */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            State Performance Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((state) => (
              <div
                key={state.state}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {state.state}
                  </span>
                  <Badge
                    variant={
                      state.approvalRate >= 75
                        ? "default"
                        : state.approvalRate >= 70
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {state.approvalRate}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Claims:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {state.claims}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Approved:</span>
                    <span className="ml-1 font-medium text-green-600">
                      {state.approved}
                    </span>
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${state.approvalRate}%`,
                      backgroundColor: getBarColor(state.approvalRate),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              High Performance (≥75%)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Medium Performance (70-74%)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Needs Improvement (&lt;70%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
