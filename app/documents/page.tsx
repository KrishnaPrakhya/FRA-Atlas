import { Suspense } from "react"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentList } from "@/components/documents/document-list"
import { DocumentStats } from "@/components/documents/document-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-balance">Document Management</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Upload, digitize, and manage forest rights claim documents with AI-powered processing
          </p>
        </div>

        {/* Document Statistics */}
        <Suspense fallback={<DocumentStatsSkeleton />}>
          <DocumentStats />
        </Suspense>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="manage">Manage Documents</TabsTrigger>
            <TabsTrigger value="processed">Processed Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Documents</CardTitle>
                <CardDescription>
                  Upload claim documents for AI-powered digitization and entity extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Documents</CardTitle>
                <CardDescription>View and manage all uploaded documents across all claims</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DocumentListSkeleton />}>
                  <DocumentList filter="all" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Processed Documents</CardTitle>
                <CardDescription>Documents that have been processed through OCR and entity extraction</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DocumentListSkeleton />}>
                  <DocumentList filter="processed" />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Loading skeletons
function DocumentStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DocumentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
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
