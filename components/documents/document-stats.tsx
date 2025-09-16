import { Card, CardContent } from "@/components/ui/card"
import { executeQuery } from "@/lib/database"
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"

export async function DocumentStats() {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_documents,
      COUNT(CASE WHEN verification_status = 'Pending' THEN 1 END) as pending_documents,
      COUNT(CASE WHEN verification_status = 'Verified' THEN 1 END) as verified_documents,
      COUNT(CASE WHEN verification_status = 'Rejected' THEN 1 END) as rejected_documents,
      COUNT(CASE WHEN ocr_text IS NOT NULL THEN 1 END) as processed_documents,
      AVG(CASE WHEN ocr_text IS NOT NULL THEN 1.0 ELSE 0.0 END) as processing_rate
    FROM claim_documents
  `

  const result = await executeQuery(statsQuery)
  const stats = result.success
    ? result.data[0]
    : {
        total_documents: 0,
        pending_documents: 0,
        verified_documents: 0,
        rejected_documents: 0,
        processed_documents: 0,
        processing_rate: 0,
      }

  const statCards = [
    {
      title: "Total Documents",
      value: stats.total_documents || 0,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Processed",
      value: stats.processed_documents || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Review",
      value: stats.pending_documents || 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Rejected",
      value: stats.rejected_documents || 0,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {index === 1 && stats.total_documents > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((stats.processing_rate || 0) * 100).toFixed(1)}% processed
                    </p>
                  )}
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
