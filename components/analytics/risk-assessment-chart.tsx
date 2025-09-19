"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

const riskFactorsData = [
  { factor: "Documentation Quality", current: 85, target: 90, maxValue: 100 },
  { factor: "Environmental Impact", current: 72, target: 80, maxValue: 100 },
  { factor: "Legal Compliance", current: 88, target: 95, maxValue: 100 },
  { factor: "Community Support", current: 79, target: 85, maxValue: 100 },
  { factor: "Land Verification", current: 82, target: 90, maxValue: 100 },
  { factor: "Processing Efficiency", current: 91, target: 95, maxValue: 100 },
];

const riskDistributionData = [
  { risk: "Low Risk", count: 567, percentage: 45.5, color: "#10b981" },
  { risk: "Medium Risk", count: 398, percentage: 31.9, color: "#f59e0b" },
  { risk: "High Risk", count: 224, percentage: 18.0, color: "#ef4444" },
  { risk: "Critical Risk", count: 58, percentage: 4.6, color: "#dc2626" },
];

const claimRiskScatterData = [
  { area: 1.2, riskScore: 0.15, approvalTime: 12, status: "approved" },
  { area: 2.8, riskScore: 0.25, approvalTime: 15, status: "approved" },
  { area: 0.8, riskScore: 0.12, approvalTime: 10, status: "approved" },
  { area: 4.5, riskScore: 0.45, approvalTime: 25, status: "review" },
  { area: 3.2, riskScore: 0.35, approvalTime: 20, status: "approved" },
  { area: 6.1, riskScore: 0.65, approvalTime: 35, status: "rejected" },
  { area: 1.8, riskScore: 0.18, approvalTime: 14, status: "approved" },
  { area: 5.2, riskScore: 0.55, approvalTime: 30, status: "review" },
  { area: 2.1, riskScore: 0.22, approvalTime: 16, status: "approved" },
  { area: 7.3, riskScore: 0.75, approvalTime: 40, status: "rejected" },
  { area: 1.5, riskScore: 0.16, approvalTime: 13, status: "approved" },
  { area: 3.8, riskScore: 0.38, approvalTime: 22, status: "approved" },
  { area: 4.9, riskScore: 0.52, approvalTime: 28, status: "review" },
  { area: 2.5, riskScore: 0.28, approvalTime: 18, status: "approved" },
  { area: 8.1, riskScore: 0.82, approvalTime: 45, status: "rejected" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "#10b981";
    case "rejected":
      return "#ef4444";
    case "review":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
};

const CustomRadarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-sm text-blue-600">Current: {payload[0]?.value}%</p>
        <p className="text-sm text-green-600">Target: {payload[1]?.value}%</p>
      </div>
    );
  }
  return null;
};

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">
          Claim Details
        </p>
        <p className="text-sm">Area: {data.area} hectares</p>
        <p className="text-sm">
          Risk Score: {(data.riskScore * 100).toFixed(1)}%
        </p>
        <p className="text-sm">Processing Time: {data.approvalTime} days</p>
        <p className="text-sm capitalize">Status: {data.status}</p>
      </div>
    );
  }
  return null;
};

export function RiskAssessmentChart() {
  const overallRiskScore =
    riskFactorsData.reduce((sum, item) => sum + item.current, 0) /
    riskFactorsData.length;
  const riskImprovement =
    riskFactorsData.reduce(
      (sum, item) => sum + (item.target - item.current),
      0
    ) / riskFactorsData.length;

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {riskDistributionData.map((risk) => (
          <Card
            key={risk.risk}
            className="border border-gray-200/50 dark:border-gray-700/50"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: risk.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {risk.risk}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {risk.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {risk.percentage}% of claims
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors Radar Chart */}
        <Card className="border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Risk Factors Analysis</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Current performance vs target across key risk factors
                </p>
              </div>
              <Badge variant="outline">
                Score: {overallRiskScore.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={riskFactorsData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>

            {/* Risk Factor Details */}
            <div className="mt-4 space-y-2">
              {riskFactorsData.map((factor) => (
                <div
                  key={factor.factor}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-300">
                    {factor.factor}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground font-medium">
                      {factor.current}%
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${factor.current}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk vs Area Scatter Plot */}
        <Card className="border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Risk vs Claim Size Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Relationship between claim area, risk score, and processing time
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="area"
                  name="Area (hectares)"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  type="number"
                  dataKey="riskScore"
                  name="Risk Score"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter
                  name="Claims"
                  data={claimRiskScatterData}
                  fill="#8884d8"
                >
                  {claimRiskScatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getStatusColor(entry.status)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Approved
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Under Review
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Rejected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Insights */}
      <Card className="border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Risk Assessment Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Key Findings
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• 77.4% of claims fall in low-medium risk categories</li>
                <li>
                  • Processing efficiency is the strongest performing factor
                </li>
                <li>• Environmental impact assessment needs improvement</li>
                <li>• Larger claims (5 hectares) show higher risk scores</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Risk Mitigation
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Enhanced documentation guidelines</li>
                <li>• Improved environmental impact assessments</li>
                <li>• Community engagement programs</li>
                <li>• Regular compliance audits</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Recommendations
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Focus on environmental compliance training</li>
                <li>• Implement early warning systems</li>
                <li>• Strengthen community verification processes</li>
                <li>• Regular risk assessment reviews</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
