"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}: any) => {
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
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ClaimStatusChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Mock data - replace with actual API call
        setData([
          {
            name: "Approved",
            value: 892,
            color: "#10b981",
          },
          {
            name: "Pending",
            value: 89,
            color: "#f59e0b",
          },
          {
            name: "Under Review",
            value: 156,
            color: "#3b82f6",
          },
          {
            name: "Rejected",
            value: 110,
            color: "#ef4444",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        // Fallback to mock data
        setData([
          {
            name: "Approved",
            value: 892,
            color: "#10b981",
          },
          {
            name: "Pending",
            value: 89,
            color: "#f59e0b",
          },
          {
            name: "Under Review",
            value: 156,
            color: "#3b82f6",
          },
          {
            name: "Rejected",
            value: 110,
            color: "#ef4444",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-emerald-400"></div>
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const totalClaims = data.reduce((sum, item) => sum + item.value, 0);

  if (totalClaims === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-white/60">
        <div className="text-center">
          <p className="text-lg font-medium">No claim data available</p>
          <p className="text-sm mt-2">
            Data will appear here once claims are submitted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.75rem",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          />
          <Legend
            iconSize={12}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ color: "white", fontSize: "14px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
