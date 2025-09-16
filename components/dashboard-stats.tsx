import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export async function DashboardStats() {
  const [totalClaims, pendingClaims, underReviewClaims, approvedClaims, rejectedClaims] = await Promise.all([
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
  ])

  const statCards = [
    {
      title: "Total Claims",
      value: totalClaims,
      icon: FileText,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Pending Review",
      value: pendingClaims + underReviewClaims,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Approved",
      value: approvedClaims,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: rejectedClaims,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">{stat.title}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} backdrop-blur-sm`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
