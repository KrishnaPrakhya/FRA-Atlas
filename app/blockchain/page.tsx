import { Suspense } from "react"
import { BlockchainDashboard } from "@/components/blockchain/blockchain-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlockchainPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Blockchain Transparency Portal
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
            Immutable record keeping and transparent tracking of all forest rights claim transactions using blockchain
            technology
          </p>
        </div>

        {/* Blockchain Dashboard */}
        <Suspense fallback={<BlockchainSkeleton />}>
          <BlockchainDashboard />
        </Suspense>
      </div>
    </div>
  )
}

function BlockchainSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
