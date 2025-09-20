import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentClaims } from "@/components/recent-claims";
import { ClaimStatusChart } from "@/components/claim-status-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilePlus,
  Eye,
  Map,
  Brain,
  Zap,
  BarChart3,
  TreePine,
  Sparkles,
  Globe,
  Users,
  Shield,
  TrendingUp,
  Clock,
  ActivityIcon,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Mountain,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-700/50">
              <TreePine className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Forest Rights Management System
              </span>
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              FRA Atlas
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Empowering communities through intelligent forest rights
              management with
              <span className="text-emerald-600 font-semibold">
                {" "}
                AI-powered insights
              </span>{" "}
              and
              <span className="text-teal-600 font-semibold">
                {" "}
                real-time analytics
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Globe className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">12+ States Covered</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5 text-teal-500" />
                <span className="text-sm">50K+ Communities</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield className="h-5 w-5 text-cyan-500" />
                <span className="text-sm">AI-Powered Security</span>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Live System Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time insights into forest rights management
                </p>
              </div>
              <Suspense fallback={<DashboardStatsSkeleton />}>
                <DashboardStats />
              </Suspense>
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Claims - Enhanced */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-gray-800/80 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                      <ActivityIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                        Recent Claims Activity
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                        Latest submissions and status updates from communities
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-1 text-sm text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>+12% this week</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated 2 min ago</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Suspense fallback={<RecentClaimsSkeleton />}>
                    <RecentClaims />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview - Enhanced */}
            <Card className="bg-gradient-to-br from-white/80 to-cyan-50/80 dark:from-gray-800/80 dark:to-cyan-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                      Status Distribution
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                      Current breakdown of all claim statuses
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>73% Approved</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-orange-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>89 Pending</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <Suspense fallback={<ChartSkeleton />}>
                  <ClaimStatusChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Revolutionary Action Hub */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <CardHeader className="relative z-10 text-center pb-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span>Action Hub</span>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  Forest Rights Management Tools
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  Powerful tools designed for efficient forest rights
                  administration
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* New Claim - Forest Theme */}
                  <a href="/claims/new" className="group">
                    <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <TreePine className="h-8 w-8 text-white" />
                          <Sparkles className="h-5 w-5 text-emerald-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          New Claim
                        </h3>
                        <p className="text-emerald-100 text-sm mb-4">
                          Submit forest rights applications with guided
                          assistance
                        </p>
                        <div className="flex items-center text-emerald-200 text-sm">
                          <span>Start Application</span>
                          <FilePlus className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* View Claims - Nature Theme */}
                  <a href="/claims" className="group">
                    <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <Leaf className="h-8 w-8 text-white" />
                          <ActivityIcon className="h-5 w-5 text-teal-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          View Claims
                        </h3>
                        <p className="text-teal-100 text-sm mb-4">
                          Monitor and manage all forest rights applications
                        </p>
                        <div className="flex items-center text-teal-200 text-sm">
                          <span>Browse Claims</span>
                          <Eye className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* AI Analysis - Tech Theme */}
                  <a href="/documents/processing" className="group">
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <Brain className="h-8 w-8 text-white" />
                          <Zap className="h-5 w-5 text-blue-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          AI Analysis
                        </h3>
                        <p className="text-blue-100 text-sm mb-4">
                          Advanced OCR and decision support powered by AI
                        </p>
                        <div className="flex items-center text-blue-200 text-sm">
                          <span>Process Documents</span>
                          <Sparkles className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Decision Support - Wisdom Theme */}
                  <a href="/decision-support" className="group">
                    <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <Shield className="h-8 w-8 text-white" />
                          <TrendingUp className="h-5 w-5 text-purple-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Decision Support
                        </h3>
                        <p className="text-purple-100 text-sm mb-4">
                          AI-powered recommendations for informed decisions
                        </p>
                        <div className="flex items-center text-purple-200 text-sm">
                          <span>Get Insights</span>
                          <Brain className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Analytics - Data Theme */}
                  <a href="/analytics" className="group">
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <BarChart3 className="h-8 w-8 text-white" />
                          <ActivityIcon className="h-5 w-5 text-green-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Analytics
                        </h3>
                        <p className="text-green-100 text-sm mb-4">
                          Comprehensive insights and performance metrics
                        </p>
                        <div className="flex items-center text-green-200 text-sm">
                          <span>View Analytics</span>
                          <BarChart3 className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Spatial Analysis - Geographic Theme */}
                  <a href="/map" className="group">
                    <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <Mountain className="h-8 w-8 text-white" />
                          <Globe className="h-5 w-5 text-orange-200 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Spatial Analysis
                        </h3>
                        <p className="text-orange-100 text-sm mb-4">
                          Interactive maps and geographical data visualization
                        </p>
                        <div className="flex items-center text-orange-200 text-sm">
                          <span>Explore Maps</span>
                          <Map className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <TreePine className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                Protecting forests, empowering communities
              </span>
              <Leaf className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Loading skeletons
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="rounded-xl">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentClaimsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-64 w-full rounded-lg" />;
}
