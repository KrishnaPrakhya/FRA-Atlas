import { Suspense } from "react"
import { DecisionDashboard } from "@/components/decision/decision-dashboard"
import { ClaimAnalysis } from "@/components/decision/claim-analysis"
import { RiskAssessment } from "@/components/decision/risk-assessment"
import { RecommendationEngine } from "@/components/decision/recommendation-engine"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function DecisionSupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-balance">AI-Powered Decision Support System</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Comprehensive analysis and recommendations for forest rights claim evaluation
          </p>
        </div>

        {/* Decision Dashboard Overview */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DecisionDashboard />
        </Suspense>

        {/* Main Decision Support Interface */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Claim Analysis</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="reports">Decision Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Claim Analysis</CardTitle>
                <CardDescription>
                  Multi-factor analysis of forest rights claims using AI and data analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<AnalysisSkeleton />}>
                  <ClaimAnalysis />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
                <CardDescription>Identify potential risks and compliance issues in claim processing</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RiskSkeleton />}>
                  <RiskAssessment />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Recommendations</CardTitle>
                <CardDescription>Machine learning powered recommendations for claim decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RecommendationSkeleton />}>
                  <RecommendationEngine />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Reports</CardTitle>
                <CardDescription>Generate comprehensive reports for decision documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Decision reports functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Loading skeletons
function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

function RiskSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12" />
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

function RecommendationSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
