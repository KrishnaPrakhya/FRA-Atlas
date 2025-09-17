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
import { Button } from "@/components/ui/button";
import { FilePlus, Eye, Map, Brain, FileText, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <main className="mt-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              FRA Atlas Dashboard
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Monitor, analyze, and manage forest rights claims with ease and
              precision.
            </p>
          </div>

          <Suspense fallback={<DashboardStatsSkeleton />}>
            <DashboardStats />
          </Suspense>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Recent Claims
                </CardTitle>
                <CardDescription>
                  The latest claims submitted for review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RecentClaimsSkeleton />}>
                  <RecentClaims />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Claim Status Overview
                </CardTitle>
                <CardDescription>
                  A snapshot of the current claim statuses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <ClaimStatusChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Quick Actions
              </CardTitle>
              <CardDescription>
                Your most common tasks, just a click away.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <a href="/claims/new">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <FilePlus className="w-8 h-8 text-primary" />
                  <span className="font-semibold">New Claim</span>
                </Button>
              </a>
              <a href="/claims">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <Eye className="w-8 h-8 text-primary" />
                  <span className="font-semibold">View All Claims</span>
                </Button>
              </a>
              <a href="/documents/processing">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group border-2 border-blue-200"
                >
                  <div className="flex items-center space-x-1">
                    <Zap className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                    <Brain className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                  </div>
                  <span className="font-semibold text-blue-600 group-hover:text-blue-700">
                    AI Analysis
                  </span>
                  <span className="text-xs text-muted-foreground">
                    OCR + DSS
                  </span>
                </Button>
              </a>
              <a href="/decision-support">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 transition-colors group"
                >
                  <Brain className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
                  <span className="font-semibold text-purple-600 group-hover:text-purple-700">
                    Decision Support
                  </span>
                </Button>
              </a>
              <a href="/map">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <Map className="w-8 h-8 text-primary" />
                  <span className="font-semibold">Spatial Analysis</span>
                </Button>
              </a>
            </CardContent>
          </Card>
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
