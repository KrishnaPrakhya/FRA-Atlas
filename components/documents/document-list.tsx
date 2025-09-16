import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { executeQuery } from "@/lib/database"
import type { ClaimDocument } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { FileText, Download, Eye, AlertCircle, CheckCircle } from "lucide-react"

interface DocumentListProps {
  filter: "all" | "processed" | "pending"
  claimId?: number
}

export async function DocumentList({ filter, claimId }: DocumentListProps) {
  let query = `
    SELECT d.*, c.claim_number, c.claimant_name 
    FROM claim_documents d
    JOIN forest_rights_claims c ON d.claim_id = c.id
  `

  const params: any[] = []
  const conditions: string[] = []

  if (claimId) {
    conditions.push("d.claim_id = $" + (params.length + 1))
    params.push(claimId)
  }

  if (filter === "processed") {
    conditions.push("d.ocr_text IS NOT NULL")
  } else if (filter === "pending") {
    conditions.push("d.verification_status = $" + (params.length + 1))
    params.push("Pending")
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ")
  }

  query += " ORDER BY d.uploaded_at DESC LIMIT 50"

  const result = await executeQuery(query, params)
  const documents: (ClaimDocument & { claim_number: string; claimant_name: string })[] = result.success
    ? result.data
    : []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No documents found matching the current filter.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(doc.verification_status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold truncate">{doc.original_filename}</h3>
                    <Badge className={getStatusColor(doc.verification_status)}>{doc.verification_status}</Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Claim:</span> {doc.claim_number} - {doc.claimant_name}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {doc.document_type}
                    </p>
                    <p>
                      <span className="font-medium">Uploaded:</span>{" "}
                      {formatDistanceToNow(new Date(doc.uploaded_at), { addSuffix: true })}
                    </p>
                    {doc.file_size && (
                      <p>
                        <span className="font-medium">Size:</span> {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>

                  {doc.ocr_text && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Extracted Text Preview:</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {doc.ocr_text.substring(0, 200)}
                        {doc.ocr_text.length > 200 && "..."}
                      </p>
                    </div>
                  )}

                  {doc.entities_extracted && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Extracted Entities:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(doc.entities_extracted as Record<string, any[]>).map(
                          ([type, entities]) =>
                            entities.length > 0 && (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}: {entities.length}
                              </Badge>
                            ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
