import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Shield, Link, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export async function BlockchainDashboard() {
  const [totalTransactions, recentTransactions, eventTypes] = await Promise.all([
    prisma.blockchainRecord.count(),
    prisma.blockchainRecord.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        claim: {
          select: {
            claimNumber: true,
            claimantName: true,
          },
        },
      },
    }),
    prisma.blockchainRecord.groupBy({
      by: ["eventType"],
      _count: {
        eventType: true,
      },
    }),
  ])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "CLAIM_SUBMITTED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "DECISION_RECORDED":
        return <Shield className="h-4 w-4 text-green-600" />
      case "DOCUMENT_VERIFIED":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "CLAIM_SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "DECISION_RECORDED":
        return "bg-green-100 text-green-800"
      case "DOCUMENT_VERIFIED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Link className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Immutable records on blockchain</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Blockchain network operational</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
            <Clock className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{eventTypes.length}</div>
            <p className="text-xs text-muted-foreground">Different transaction types</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5 text-violet-600" />
            <span>Recent Blockchain Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getEventIcon(transaction.eventType)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{transaction.claim?.claimNumber || "System Event"}</span>
                        <Badge className={`${getEventColor(transaction.eventType)} text-xs`}>
                          {transaction.eventType.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {transaction.claim?.claimantName || "System Transaction"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-violet-600">
                      {transaction.transactionHash.slice(0, 10)}...{transaction.transactionHash.slice(-8)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Type Distribution */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Transaction Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventTypes.map((eventType) => (
              <div
                key={eventType.eventType}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(eventType.eventType)}
                    <span className="text-sm font-medium">{eventType.eventType.replace("_", " ")}</span>
                  </div>
                  <span className="text-lg font-bold text-violet-600">{eventType._count.eventType}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Actions */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Blockchain Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="glass border-violet-200 hover:bg-violet-50 bg-transparent">
              <Shield className="h-4 w-4 mr-2" />
              Verify Transaction
            </Button>
            <Button variant="outline" className="glass border-indigo-200 hover:bg-indigo-50 bg-transparent">
              <Link className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
            <Button variant="outline" className="glass border-purple-200 hover:bg-purple-50 bg-transparent">
              <Clock className="h-4 w-4 mr-2" />
              Transaction History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
