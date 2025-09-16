import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentClaims } from "@/components/recent-claims"
import { ClaimStatusChart } from "@/components/claim-status-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Forest Rights Act Atlas</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Comprehensive digital platform for managing forest rights claims, document verification, and spatial data
            analysis
          </p>
        </div>

        {/* Dashboard Stats */}
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Latest forest rights claims submitted to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentClaimsSkeleton />}>
                <RecentClaims />
              </Suspense>
            </CardContent>
          </Card>

          {/* Claim Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Claim Status Distribution</CardTitle>
              <CardDescription>Overview of claim statuses across all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <ClaimStatusChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/claims/new"
                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-semibold">Submit New Claim</h3>
                <p className="text-sm text-muted-foreground">Start a new forest rights claim application</p>
              </a>
              <a
                href="/claims"
                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-semibold">View All Claims</h3>
                <p className="text-sm text-muted-foreground">Browse and manage existing claims</p>
              </a>
              <a
                href="/map"
                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-semibold">Spatial Data</h3>
                <p className="text-sm text-muted-foreground">View forest boundaries and claim areas</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Loading skeletons
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentClaimsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-64 w-full" />
}
