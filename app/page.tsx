"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentClaims } from "@/components/recent-claims";
import { ClaimStatusChart } from "@/components/claim-status-chart";
import forestLogo from "../public/forest-boundary.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  ActivityIcon,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Mountain,
  ArrowRight,
  Star,
  Award,
  Compass,
  Wind,
  Flower2,
  Bird,
  Flag,
  Sun,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingElements = [
    { icon: Leaf, delay: 0, duration: 6, color: "text-emerald-400" },
    { icon: Flag, delay: 1, duration: 8, color: "text-purple-400" },
    { icon: Bird, delay: 2, duration: 7, color: "text-blue-400" },
    { icon: Flower2, delay: 3, duration: 9, color: "text-pink-400" },
    { icon: TreePine, delay: 4, duration: 5, color: "text-green-500" },
    { icon: Sun, delay: 5, duration: 10, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 animate-pulse"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Nature Elements */}
        {mounted &&
          floatingElements.map((element, i) => {
            const Icon = element.icon;
            return (
              <div
                key={i}
                className={`absolute ${element.color} opacity-20 animate-bounce`}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                  animationDelay: `${element.delay}s`,
                  animationDuration: `${element.duration}s`,
                }}
              >
                <Icon className="h-8 w-8" />
              </div>
            );
          })}

        {/* Animated Waves */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-emerald-500/20 animate-pulse"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-teal-500/30 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-cyan-500/40 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          {/* Hero Section */}
          <section className="relative h-[400px] mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
            {/* background image */}
            <div className="absolute inset-0">
              <Image
                src={forestLogo}
                alt="Aerial forest landscape used as contextual background"
                fill
                priority
                className="object-cover"
              />
              {/* simple scrim for contrast */}
              <div className="absolute inset-0 bg-slate-600/30" />
            </div>

            {/* concise content */}
            <div className="relative z-10 p-8 md:p-12">
              <p className="text-sm font-medium text-emerald-400">
                Decision Support System
              </p>
              <h1 className="mt-2 max-w-2xl text-balance text-4xl font-bold text-white md:text-6xl">
                A new way to see your forests
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-slate-200 md:text-lg">
                Real-time, AI-assisted spatial intelligence for equitable forest
                rights.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => router.push("/map")}
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  Explore Spatial Maps
                </Button>
                <Button
                  onClick={() => router.push("/analytics")}
                  size="lg"
                  variant="outline"
                  className=" text-white hover:bg-slate-800 bg-transparent"
                >
                  View Analytics
                </Button>
              </div>
            </div>
          </section>

          {/* Revolutionary Stats Section */}
          <div className="relative">
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl animate-pulse"></div>

              <div className="relative z-10 p-8">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-6 py-3 rounded-full mb-6">
                    <ActivityIcon className="h-5 w-5 text-emerald-400 animate-pulse" />
                    <span className="text-emerald-200 font-medium">
                      LIVE DASHBOARD
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    System Overview
                  </h2>
                  <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                    Real-time insights into forest rights management across the
                    nation
                  </p>
                </div>

                <Suspense fallback={<DashboardStatsSkeleton />}>
                  <DashboardStats />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Spectacular Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Claims - Completely Redesigned */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-2xl border border-emerald-400/20 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-700 rounded-3xl overflow-hidden group relative">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>

                <CardHeader className="relative z-10 pb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-xl">
                          <ActivityIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-white mb-2">
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-emerald-200 text-lg">
                          Latest forest rights submissions and updates
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-emerald-500/20 px-4 py-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-200 font-medium">
                        +12% this week
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-teal-500/20 px-4 py-2 rounded-full">
                      <Clock className="h-5 w-5 text-teal-400" />
                      <span className="text-teal-200 font-medium">
                        Live updates
                      </span>
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

            {/* Status Overview - Completely Redesigned */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl border border-cyan-400/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700 rounded-3xl overflow-hidden group relative">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                    }}
                  />
                ))}
              </div>

              <CardHeader className="relative z-10 pb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                      Status Overview
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-lg">
                      Real-time claim status distribution
                    </CardDescription>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-200 font-medium">
                      73% Approved
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="text-orange-200 font-medium">
                      89 Pending Review
                    </span>
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

          {/* Mind-Blowing Action Hub */}
          <div className="relative">
            {/* Epic Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl blur-2xl animate-pulse delay-1000"></div>

            <Card className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
              {/* Animated Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl animate-pulse blur-sm"></div>

              <CardHeader className="relative z-10 text-center pb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-8 shadow-2xl">
                  <Compass className="h-6 w-6 animate-spin" />
                  <span>FOREST COMMAND CENTER</span>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>

                <CardTitle className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Management Tools
                </CardTitle>
                <CardDescription className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
                  Advanced AI-powered tools for comprehensive forest rights
                  administration and community empowerment
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 px-8 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* New Claim - Revolutionary Design */}
                  <a href="/claims/new" className="group">
                    <div className="relative bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 hover:scale-110 hover:rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <Leaf className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <TreePine className="h-10 w-10 text-white" />
                          </div>
                          <Sparkles className="h-8 w-8 text-emerald-200 animate-pulse group-hover:animate-spin" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          NEW CLAIM
                        </h3>
                        <p className="text-emerald-100 text-base mb-6 leading-relaxed">
                          Submit forest rights applications with AI-powered
                          guidance and real-time validation
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-emerald-200 font-semibold">
                            <span>Start Journey</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <FilePlus className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* View Claims - Spectacular Design */}
                  <a href="/claims" className="group">
                    <div className="relative bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 rounded-3xl p-8 shadow-2xl hover:shadow-teal-500/25 transition-all duration-700 hover:scale-110 hover:-rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <Wind className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Eye className="h-10 w-10 text-white" />
                          </div>
                          <ActivityIcon className="h-8 w-8 text-teal-200 animate-pulse group-hover:animate-bounce" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          VIEW CLAIMS
                        </h3>
                        <p className="text-teal-100 text-base mb-6 leading-relaxed">
                          Monitor, track, and manage all forest rights
                          applications with advanced filtering
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-teal-200 font-semibold">
                            <span>Explore Database</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <Leaf className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* AI Analysis - Futuristic Design */}
                  <a href="/documents/processing" className="group">
                    <div className="relative bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 hover:scale-110 hover:rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <Zap className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Brain className="h-10 w-10 text-white" />
                          </div>
                          <Sparkles className="h-8 w-8 text-purple-200 animate-pulse group-hover:animate-spin" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          AI ANALYSIS
                        </h3>
                        <p className="text-purple-100 text-base mb-6 leading-relaxed">
                          Advanced OCR, document processing, and intelligent
                          decision support systems
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-purple-200 font-semibold">
                            <span>Process Now</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <Brain className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Decision Support - Wisdom Design */}
                  <a href="/decision-support" className="group">
                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-600 rounded-3xl p-8 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-700 hover:scale-110 hover:-rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <Star className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Shield className="h-10 w-10 text-white" />
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-200 animate-pulse group-hover:animate-bounce" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          DECISION SUPPORT
                        </h3>
                        <p className="text-purple-100 text-base mb-6 leading-relaxed">
                          AI-powered recommendations and insights for informed
                          forest rights decisions
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-purple-200 font-semibold">
                            <span>Get Insights</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <Award className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Analytics - Data Visualization Design */}
                  <a href="/analytics" className="group">
                    <div className="relative bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-700 hover:scale-110 hover:rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <TrendingUp className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <BarChart3 className="h-10 w-10 text-white" />
                          </div>
                          <ActivityIcon className="h-8 w-8 text-green-200 animate-pulse group-hover:animate-spin" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          ANALYTICS
                        </h3>
                        <p className="text-green-100 text-base mb-6 leading-relaxed">
                          Comprehensive insights, performance metrics, and data
                          visualization dashboards
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-200 font-semibold">
                            <span>View Insights</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <BarChart3 className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Spatial Analysis - Geographic Design */}
                  <a href="/map" className="group">
                    <div className="relative bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 rounded-3xl p-8 shadow-2xl hover:shadow-orange-500/25 transition-all duration-700 hover:scale-110 hover:-rotate-1 overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <Compass className="h-6 w-6 text-white animate-pulse" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Map className="h-10 w-10 text-white" />
                          </div>
                          <Globe className="h-8 w-8 text-orange-200 animate-pulse group-hover:animate-spin" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3">
                          SPATIAL MAPS
                        </h3>
                        <p className="text-orange-100 text-base mb-6 leading-relaxed">
                          Interactive maps, GIS analysis, and geographical data
                          visualization tools
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-orange-200 font-semibold">
                            <span>Explore Maps</span>
                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                          <Mountain className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Epic Footer Section */}
          <div className="text-center py-16">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Animated Divider */}
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                <div className="flex items-center space-x-2">
                  <TreePine className="h-8 w-8 text-emerald-400 animate-pulse" />
                  <Sparkles className="h-6 w-6 text-teal-400 animate-spin" />
                  <Leaf className="h-8 w-8 text-green-400 animate-pulse" />
                </div>
                <div className="h-px w-32 bg-gradient-to-l from-transparent via-emerald-400 to-transparent"></div>
              </div>

              {/* Mission Statement */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">Our Mission</h3>
                <p className="text-xl text-emerald-200 leading-relaxed max-w-2xl mx-auto">
                  Protecting forests, empowering communities, and preserving our
                  planet's green heritage through innovative technology
                </p>
              </div>

              {/* Floating Nature Elements */}
              <div className="flex items-center justify-center space-x-8 pt-8">
                {[
                  {
                    icon: TreePine,
                    color: "text-emerald-400",
                    label: "Forests",
                  },
                  { icon: Users, color: "text-teal-400", label: "Communities" },
                  { icon: Shield, color: "text-cyan-400", label: "Protection" },
                  {
                    icon: Globe,
                    color: "text-blue-400",
                    label: "Global Impact",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="group flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-110"
                    >
                      <Icon
                        className={`h-8 w-8 ${item.color} group-hover:animate-pulse`}
                      />
                      <span className="text-sm text-white/80 font-medium">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Copyright */}
              <div className="pt-8 text-emerald-200/60">
                <p className="text-sm">
                  © 2025 FRA Atlas. Empowering sustainable forest management
                  worldwide.
                </p>
              </div>
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
