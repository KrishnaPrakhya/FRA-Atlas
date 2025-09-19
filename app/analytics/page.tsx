"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Users,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ClaimsOverviewChart } from "@/components/analytics/claims-overview-chart";
import { StatusDistributionChart } from "@/components/analytics/status-distribution-chart";
import { ProcessingTimeChart } from "@/components/analytics/processing-time-chart";
import { TrendAnalysisChart } from "@/components/analytics/trend-analysis-chart";
import { RegionalAnalysisChart } from "@/components/analytics/regional-analysis-chart";
import { RiskAssessmentChart } from "@/components/analytics/risk-assessment-chart";
import { DashboardHeader } from "@/components/dashboard-header";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <DashboardHeader />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Comprehensive insights and analytics for forest rights claims
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    1,247
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Claims
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    73.2%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Approval Rate
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+2.1%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">18.5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Avg Days
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-red-600 mr-1 rotate-180" />
                <span className="text-red-600">-3.2%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">89</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Pending Review
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-orange-600">+5.7%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            {/* <TabsTrigger value="performance">Performance</TabsTrigger> */}
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaimsOverviewChart />
              <StatusDistributionChart />
            </div>
            <ProcessingTimeChart />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <TrendAnalysisChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Monthly Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Monthly submission trends chart will be rendered here
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Seasonal Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Seasonal patterns chart will be rendered here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional" className="space-y-6">
            <RegionalAnalysisChart />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Processing Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Processing efficiency metrics chart
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Decision Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Decision accuracy tracking chart
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <RiskAssessmentChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
