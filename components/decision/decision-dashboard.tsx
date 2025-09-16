import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export async function DecisionDashboard() {
  const [totalPending, underReview, avgScores, overdueClaims] = await Promise.all([
    prisma.forestRightsClaim.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW", "PENDING_DOCUMENTS"],
        },
      },
    }),
    prisma.forestRightsClaim.count({
      where: {
        status: "UNDER_REVIEW",
      },
    }),
    prisma.decisionFactor.groupBy({
      by: ["factorType"],
      _avg: {
        factorValue: true,
      },
      where: {
        claim: {
          status: {
            in: ["SUBMITTED", "UNDER_REVIEW"],
          },
        },
      },
    }),
    prisma.forestRightsClaim.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
        submissionDate: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      },
    }),
  ])

  // Calculate average scores by factor type
  const avgLegalScore = avgScores.find((s) => s.factorType === "Legal")?._avg.factorValue || 0

  const dashboardCards = [
    {
      title: "Pending Decisions",
      value: totalPending,
      description: `${underReview} under active review`,
      icon: Clock,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Average Compliance Score",
      value: `${(avgLegalScore * 100).toFixed(1)}%`,
      description: "Legal compliance rating",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Risk Alerts",
      value: overdueClaims,
      description: "Claims requiring immediate attention",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dashboardCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={index}
            className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">{card.title}</CardTitle>
              <div className={`p-3 rounded-xl ${card.bgColor} backdrop-blur-sm`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>

              {/* Mini trend indicator with glassmorphism */}
              <div className="flex items-center mt-3 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-600 font-medium">+2.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
