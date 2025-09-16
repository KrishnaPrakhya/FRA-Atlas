import { Suspense } from "react"
import { MapContainer } from "@/components/map/map-container"
import { MapControls } from "@/components/map/map-controls"
import { ClaimsList } from "@/components/map/claims-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-balance">WebGIS Mapping Platform</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Interactive mapping system for forest boundaries, claim areas, and spatial analysis
          </p>
        </div>

        {/* Map Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Map Controls Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Map Controls</CardTitle>
                <CardDescription>Filter and customize map display</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MapControlsSkeleton />}>
                  <MapControls />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims Overview</CardTitle>
                <CardDescription>Browse claims by location</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<ClaimsListSkeleton />}>
                  <ClaimsList />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Main Map */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <MapContainer />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeletons
function MapControlsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
}

function ClaimsListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
