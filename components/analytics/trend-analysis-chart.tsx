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
  Legend,
  Area,
  ComposedChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const data = [
  {
    month: "Jan 2023",
    submissions: 120,
    approvals: 85,
    rejections: 25,
    approvalRate: 70.8,
    avgProcessingTime: 22,
    cumulativeApprovals: 85,
  },
  {
    month: "Feb 2023",
    submissions: 135,
    approvals: 95,
    rejections: 30,
    approvalRate: 70.4,
    avgProcessingTime: 21,
    cumulativeApprovals: 180,
  },
  {
    month: "Mar 2023",
    submissions: 148,
    approvals: 110,
    rejections: 28,
    approvalRate: 74.3,
    avgProcessingTime: 19,
    cumulativeApprovals: 290,
  },
  {
    month: "Apr 2023",
    submissions: 162,
    approvals: 125,
    rejections: 22,
    approvalRate: 77.2,
    avgProcessingTime: 18,
    cumulativeApprovals: 415,
  },
  {
    month: "May 2023",
    submissions: 155,
    approvals: 118,
    rejections: 27,
    approvalRate: 76.1,
    avgProcessingTime: 20,
    cumulativeApprovals: 533,
  },
  {
    month: "Jun 2023",
    submissions: 178,
    approvals: 135,
    rejections: 33,
    approvalRate: 75.8,
    avgProcessingTime: 17,
    cumulativeApprovals: 668,
  },
  {
    month: "Jul 2023",
    submissions: 165,
    approvals: 128,
    rejections: 25,
    approvalRate: 77.6,
    avgProcessingTime: 19,
    cumulativeApprovals: 796,
  },
  {
    month: "Aug 2023",
    submissions: 185,
    approvals: 142,
    rejections: 31,
    approvalRate: 76.8,
    avgProcessingTime: 16,
    cumulativeApprovals: 938,
  },
  {
    month: "Sep 2023",
    submissions: 172,
    approvals: 134,
    rejections: 28,
    approvalRate: 77.9,
    avgProcessingTime: 18,
    cumulativeApprovals: 1072,
  },
  {
    month: "Oct 2023",
    submissions: 195,
    approvals: 148,
    rejections: 35,
    approvalRate: 75.9,
    avgProcessingTime: 15,
    cumulativeApprovals: 1220,
  },
  {
    month: "Nov 2023",
    submissions: 188,
    approvals: 145,
    rejections: 33,
    approvalRate: 77.1,
    avgProcessingTime: 17,
    cumulativeApprovals: 1365,
  },
  {
    month: "Dec 2023",
    submissions: 205,
    approvals: 158,
    rejections: 37,
    approvalRate: 77.1,
    avgProcessingTime: 18,
    cumulativeApprovals: 1523,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[250px]">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600">
            Submissions: {data.submissions}
          </p>
          <p className="text-sm text-green-600">Approvals: {data.approvals}</p>
          <p className="text-sm text-red-600">Rejections: {data.rejections}</p>
          <p className="text-sm text-purple-600">
            Approval Rate: {data.approvalRate}%
          </p>
          <p className="text-sm text-orange-600">
            Avg Processing: {data.avgProcessingTime} days
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function TrendAnalysisChart() {
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  const submissionTrend = (
    ((latestData.submissions - previousData.submissions) /
      previousData.submissions) *
    100
  ).toFixed(1);
  const approvalRateTrend = (
    latestData.approvalRate - previousData.approvalRate
  ).toFixed(1);
  const processingTimeTrend = (
    ((previousData.avgProcessingTime - latestData.avgProcessingTime) /
      previousData.avgProcessingTime) *
    100
  ).toFixed(1);

  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <span>Trend Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              12-month performance trends and patterns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              {parseFloat(submissionTrend) > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span>Submissions: {submissionTrend}%</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />

            {/* Bar chart for submissions */}
            <Bar
              yAxisId="left"
              dataKey="submissions"
              name="Submissions"
              fill="#3b82f6"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
            />

            {/* Line chart for approval rate */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="approvalRate"
              name="Approval Rate (%)"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />

            {/* Line chart for processing time */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgProcessingTime"
              name="Avg Processing Time (days)"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Trend Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Submissions Trend
              </span>
              {parseFloat(submissionTrend) > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {submissionTrend}%
            </div>
            <div className="text-xs text-gray-500">vs previous month</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Approval Rate
              </span>
              {parseFloat(approvalRateTrend) > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-green-600">
              {approvalRateTrend}%
            </div>
            <div className="text-xs text-gray-500">percentage points</div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Processing Speed
              </span>
              {parseFloat(processingTimeTrend) > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {processingTimeTrend}%
            </div>
            <div className="text-xs text-gray-500">faster processing</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Key Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                • Submissions have shown consistent growth with seasonal
                variations
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                • Approval rates have stabilized around 77% after initial
                improvements
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                • Processing times have improved by 18% over the year
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                • Peak submission periods occur in March, June, and October
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
