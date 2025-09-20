"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Activity,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TreePine,
  Sparkles,
  Eye,
  Zap,
  Leaf,
  Mountain,
  Globe,
  Shield,
  Target,
  Award,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
} from "lucide-react";
import { ClaimsOverviewChart } from "@/components/analytics/claims-overview-chart";
import { StatusDistributionChart } from "@/components/analytics/status-distribution-chart";
import { ProcessingTimeChart } from "@/components/analytics/processing-time-chart";
import { TrendAnalysisChart } from "@/components/analytics/trend-analysis-chart";
import { RegionalAnalysisChart } from "@/components/analytics/regional-analysis-chart";
import { RiskAssessmentChart } from "@/components/analytics/risk-assessment-chart";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-700/50">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Advanced Analytics Dashboard
              </span>
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Forest Insights
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive analytics and performance metrics for
              <span className="text-emerald-600 font-semibold">
                {" "}
                intelligent forest rights management
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Activity className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Target className="h-5 w-5 text-teal-500" />
                <span className="text-sm">AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Award className="h-5 w-5 text-cyan-500" />
                <span className="text-sm">Performance Tracking</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 pt-6">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="text-emerald-700">Filter Data</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2 text-teal-600" />
                <span className="text-teal-700">Refresh</span>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Enhanced Key Metrics */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Claims Card */}
              <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TreePine className="h-8 w-8 text-white" />
                    </div>
                    <Sparkles className="h-5 w-5 text-emerald-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">1,247</div>
                  <div className="text-emerald-100 text-sm mb-3">
                    Total Claims
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-200 mr-1" />
                    <span className="text-emerald-200">
                      +12.5% vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Rate Card */}
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <Activity className="h-5 w-5 text-teal-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">73.2%</div>
                  <div className="text-teal-100 text-sm mb-3">
                    Approval Rate
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-teal-200 mr-1" />
                    <span className="text-teal-200">+2.1% vs last month</span>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Time Card */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <Clock className="h-5 w-5 text-blue-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">18.5</div>
                  <div className="text-blue-100 text-sm mb-3">Avg Days</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-200 mr-1 rotate-180" />
                    <span className="text-blue-200">-3.2 days improvement</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Review Card */}
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <AlertTriangle className="h-5 w-5 text-purple-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">89</div>
                  <div className="text-purple-100 text-sm mb-3">
                    Pending Review
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-purple-200 mr-1" />
                    <span className="text-purple-200">+5.7% vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Main Charts */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <Tabs
                defaultValue="overview"
                className="relative z-10 p-8 space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <BarChart3 className="h-4 w-4" />
                    <span>Interactive Analytics</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                    Comprehensive Data Insights
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    Explore detailed analytics across different dimensions
                  </p>
                </div>

                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-emerald-200/30 dark:border-emerald-700/30">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trends
                  </TabsTrigger>
                  <TabsTrigger
                    value="regional"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Regional
                  </TabsTrigger>
                  <TabsTrigger
                    value="risk"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Risk Analysis
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Claims Overview Chart */}
                    <Card className="bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-gray-800/80 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                            <BarChart3 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                              Claims Overview
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                              Monthly submission and approval trends
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <ClaimsOverviewChart />
                      </CardContent>
                    </Card>

                    {/* Status Distribution Chart */}
                    <Card className="bg-gradient-to-br from-white/80 to-cyan-50/80 dark:from-gray-800/80 dark:to-cyan-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                              Status Distribution
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                              Current breakdown of claim statuses
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <StatusDistributionChart />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Processing Time Chart */}
                  <Card className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                            Processing Time Analysis
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                            Average processing time trends over the last 12
                            months
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ProcessingTimeChart />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-8">
                  {/* Trend Analysis Chart */}
                  <Card className="bg-gradient-to-br from-white/80 to-teal-50/80 dark:from-gray-800/80 dark:to-teal-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                            Comprehensive Trend Analysis
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                            12-month performance trends and patterns
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <TrendAnalysisChart />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Submissions */}
                    <Card className="bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                              Monthly Submissions
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                              Submission patterns throughout the year
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-4">
                          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                            <Calendar className="h-12 w-12 text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              Monthly Submission Trends
                            </p>
                            <p className="text-sm text-gray-500">
                              Interactive chart coming soon
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seasonal Patterns */}
                    <Card className="bg-gradient-to-br from-white/80 to-orange-50/80 dark:from-gray-800/80 dark:to-orange-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                            <Mountain className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                              Seasonal Patterns
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                              Seasonal variations in claim submissions
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-4">
                          <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl">
                            <Mountain className="h-12 w-12 text-orange-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              Seasonal Analysis
                            </p>
                            <p className="text-sm text-gray-500">
                              Advanced patterns visualization
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Regional Tab */}
                <TabsContent value="regional" className="space-y-8">
                  <Card className="bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                            Regional Performance Analysis
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                            State and district-wise performance metrics
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-1 text-sm text-green-600">
                          <Globe className="h-4 w-4" />
                          <span>12 States</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mountain className="h-4 w-4" />
                          <span>156 Districts</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <RegionalAnalysisChart />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Risk Analysis Tab */}
                <TabsContent value="risk" className="space-y-8">
                  <Card className="bg-gradient-to-br from-white/80 to-orange-50/80 dark:from-gray-800/80 dark:to-orange-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                            Risk Assessment Dashboard
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                            Comprehensive risk analysis across all claims
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-1 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>67% Low Risk</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-orange-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span>23% Medium Risk</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <RiskAssessmentChart />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                Data-driven insights for sustainable forest management
              </span>
              <Leaf className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
