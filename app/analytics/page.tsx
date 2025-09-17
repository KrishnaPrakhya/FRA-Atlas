import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Calendar,
  Filter,
  Users,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Analytics & Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights and data analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Processing Time</p>
                  <p className="text-2xl font-bold">45 days</p>
                  <p className="text-blue-200 text-xs">Average</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-green-200 text-xs">Approval rate</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Users</p>
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-purple-200 text-xs">This month</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Documents</p>
                  <p className="text-2xl font-bold">15,234</p>
                  <p className="text-orange-200 text-xs">Processed</p>
                </div>
                <FileText className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Claims Trend Chart */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Claims Trend
              </CardTitle>
              <CardDescription className="text-blue-100">
                Monthly submission trends over the past year
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Line Chart</p>
                  <p className="text-sm text-gray-500">
                    Claims submission trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Status Distribution
              </CardTitle>
              <CardDescription className="text-green-100">
                Current status breakdown of all claims
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Pie Chart</p>
                  <p className="text-sm text-gray-500">Status distribution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Analysis */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle>Regional Analysis</CardTitle>
            <CardDescription className="text-purple-100">
              Claims distribution across different states and districts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { state: "Madhya Pradesh", claims: 1234, percentage: 35 },
                { state: "Chhattisgarh", claims: 987, percentage: 28 },
                { state: "Odisha", claims: 756, percentage: 21 },
                { state: "Jharkhand", claims: 543, percentage: 16 },
              ].map((region, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {region.state}
                    </h4>
                    <Badge variant="secondary">{region.percentage}%</Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {region.claims.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total claims</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Processing Times */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Processing Times
              </CardTitle>
              <CardDescription>
                Average time taken at each stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  stage: "Initial Review",
                  time: "7 days",
                  color: "bg-blue-500",
                },
                {
                  stage: "Field Verification",
                  time: "21 days",
                  color: "bg-amber-500",
                },
                {
                  stage: "Legal Review",
                  time: "14 days",
                  color: "bg-purple-500",
                },
                {
                  stage: "Final Decision",
                  time: "3 days",
                  color: "bg-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium">{item.stage}</span>
                  </div>
                  <Badge variant="outline">{item.time}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Success Factors */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Success Factors
              </CardTitle>
              <CardDescription>
                Key factors affecting claim approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  factor: "Complete Documentation",
                  impact: "92%",
                  color: "bg-green-500",
                },
                {
                  factor: "Clear Land Boundaries",
                  impact: "87%",
                  color: "bg-blue-500",
                },
                {
                  factor: "Community Support",
                  impact: "78%",
                  color: "bg-purple-500",
                },
                {
                  factor: "Historical Evidence",
                  impact: "65%",
                  color: "bg-amber-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium">{item.factor}</span>
                  </div>
                  <Badge variant="outline">{item.impact}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
