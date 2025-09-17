import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

export async function DashboardStats() {
  const [
    totalClaims,
    pendingClaims,
    underReviewClaims,
    approvedClaims,
    rejectedClaims,
  ] = await Promise.all([
    prisma.forestRightsClaim.count(),
    prisma.forestRightsClaim.count({
      where: { status: "SUBMITTED" },
    }),
    prisma.forestRightsClaim.count({
      where: { status: "UNDER_REVIEW" },
    }),
    prisma.forestRightsClaim.count({
      where: { status: "APPROVED" },
    }),
    prisma.forestRightsClaim.count({
      where: { status: "REJECTED" },
    }),
  ]);

  const statCards = [
    {
      title: "Total Claims",
      value: totalClaims,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Pending Review",
      value: pendingClaims + underReviewClaims,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      change: "+5%",
      changeType: "increase" as const,
    },
    {
      title: "Approved",
      value: approvedClaims,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
      change: "+18%",
      changeType: "increase" as const,
    },
    {
      title: "Rejected",
      value: rejectedClaims,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      change: "-3%",
      changeType: "decrease" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
            />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <TrendingUp
                    className={`h-4 w-4 ${
                      stat.changeType === "decrease" ? "rotate-180" : ""
                    }`}
                  />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
