"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { executeQuery } from "@/lib/database"
import type { ForestRightsClaim } from "@/lib/types"
import { MapPin } from "lucide-react"

export async function ClaimsList() {
  const query = `
    SELECT c.*, 
           CASE 
             WHEN c.district = 'Dehradun' THEN 30.3165 + (RANDOM() - 0.5) * 0.1
             WHEN c.district = 'Haridwar' THEN 29.9457 + (RANDOM() - 0.5) * 0.1
             ELSE 30.0668 + (RANDOM() - 0.5) * 0.1
           END as lat,
           CASE 
             WHEN c.district = 'Dehradun' THEN 78.0322 + (RANDOM() - 0.5) * 0.1
             WHEN c.district = 'Haridwar' THEN 78.1642 + (RANDOM() - 0.5) * 0.1
             ELSE 79.0193 + (RANDOM() - 0.5) * 0.1
           END as lng
    FROM forest_rights_claims c
    ORDER BY c.submission_date DESC
    LIMIT 20
  `

  const result = await executeQuery(query)
  const claims: (ForestRightsClaim & { lat: number; lng: number })[] = result.success ? result.data : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (claims.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No claims found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 p-4">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
            onClick={() => {
              // Focus map on this claim
              console.log("Focus on claim:", claim.id, claim.lat, claim.lng)
            }}
          >
            <div className="flex-shrink-0 mt-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    claim.status === "Approved"
                      ? "#22c55e"
                      : claim.status === "Rejected"
                        ? "#ef4444"
                        : claim.status === "Under Review"
                          ? "#eab308"
                          : "#6b7280",
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-medium text-sm truncate">{claim.claim_number}</p>
                <Badge className={`${getStatusColor(claim.status)} text-xs`}>{claim.status}</Badge>
              </div>

              <p className="text-xs text-muted-foreground truncate">{claim.claimant_name}</p>

              <p className="text-xs text-muted-foreground">
                {claim.village_name}, {claim.district}
              </p>

              {claim.forest_area_hectares && (
                <p className="text-xs text-muted-foreground">{claim.forest_area_hectares} hectares</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
