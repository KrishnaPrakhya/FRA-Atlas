import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

export async function RecentClaims() {
  const claims = await prisma.forestRightsClaim.findMany({
    orderBy: { submissionDate: "desc" },
    take: 5,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "PENDING_DOCUMENTS":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="space-y-2">
          <p>No claims found.</p>
          <p className="text-sm">Submit your first claim to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">{claim.claimantName.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{claim.claimantName}</p>
                <p className="text-sm text-muted-foreground">
                  {claim.villageName}, {claim.district}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(claim.submissionDate), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={`${getStatusColor(claim.status)} backdrop-blur-sm border-0 shadow-sm`}>
              {formatStatus(claim.status)}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">{claim.claimNumber}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
