"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Zap,
  Star,
  Award,
} from "lucide-react";

interface StatsData {
  totalClaims: number;
  pendingClaims: number;
  underReviewClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalClaims: 0,
    pendingClaims: 0,
    underReviewClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use mock data. In production, you'd fetch from an API
    const fetchStats = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        setStats({
          totalClaims: 1247,
          pendingClaims: 89,
          underReviewClaims: 156,
          approvedClaims: 892,
          rejectedClaims: 110,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to mock data
        setStats({
          totalClaims: 1247,
          pendingClaims: 89,
          underReviewClaims: 156,
          approvedClaims: 892,
          rejectedClaims: 110,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const {
    totalClaims,
    pendingClaims,
    underReviewClaims,
    approvedClaims,
    rejectedClaims,
  } = stats;

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl"
          >
            <CardContent className="p-8">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl"></div>
                  <div className="w-16 h-6 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="w-24 h-4 bg-white/20 rounded"></div>
                  <div className="w-20 h-8 bg-white/20 rounded"></div>
                  <div className="w-32 h-3 bg-white/20 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-110 hover:rotate-1 rounded-3xl"
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${
                      stat.changeType === "increase"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <TrendingUp
                      className={`h-4 w-4 ${
                        stat.changeType === "decrease" ? "rotate-180" : ""
                      }`}
                    />
                    <span>{stat.change}</span>
                  </div>
                  <Sparkles className="h-5 w-5 text-white/40 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-bold text-white/80 tracking-wide">
                  {stat.title.toUpperCase()}
                </p>
                <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform duration-300">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                  <p className="text-sm text-white/60 font-medium">
                    vs last month
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
