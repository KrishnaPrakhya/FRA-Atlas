"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { DocumentViewDialog } from "./document-view-dialog";

interface DocumentListProps {
  documents: Array<{
    id: string;
    claim_number: string;
    claimant_name: string;
    document_type: string;
    verification_status: string;
    uploaded_at: string;
    file_size?: number;
    ocr_text?: string;
    entities_extracted?: Record<string, any>;
    confidence?: number;
    original_filename?: string;
  }>;
}

export function DocumentList({ documents }: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No documents found matching the current filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(doc.verification_status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold truncate">
                      {doc.original_filename || `Document ${doc.id}`}
                    </h3>
                    <Badge className={getStatusColor(doc.verification_status)}>
                      {doc.verification_status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Claim:</span>{" "}
                      {doc.claim_number} - {doc.claimant_name}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {doc.document_type}
                    </p>
                    <p>
                      <span className="font-medium">Uploaded:</span>{" "}
                      {formatDistanceToNow(new Date(doc.uploaded_at), {
                        addSuffix: true,
                      })}
                    </p>
                    {doc.file_size && (
                      <p>
                        <span className="font-medium">Size:</span>{" "}
                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>

                  {doc.ocr_text && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">
                        Extracted Text Preview:
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {doc.ocr_text.substring(0, 200)}
                        {doc.ocr_text.length > 200 && "..."}
                      </p>
                    </div>
                  )}

                  {doc.entities_extracted && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">
                        Extracted Entities:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(doc.entities_extracted).map(
                          ([type, entities]) =>
                            entities.length > 0 && (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs"
                              >
                                {type}: {entities.length}
                              </Badge>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                  disabled={!doc.ocr_text}
                >
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

      <DocumentViewDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedDocument(null);
        }}
        documentData={selectedDocument}
      />
    </div>
  );
}
