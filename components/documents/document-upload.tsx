"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { useDocuments } from "@/components/providers/document-provider";
import { OCRService } from "@/lib/ocr-client";

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  result?: any;
  error?: string;
}

const DOCUMENT_TYPES = [
  { value: "identity_proof", label: "Identity Proof" },
  { value: "land_records", label: "Land Records" },
  { value: "forest_clearance", label: "Forest Clearance" },
  { value: "survey_settlement", label: "Survey Settlement" },
  { value: "revenue_records", label: "Revenue Records" },
  { value: "community_certificate", label: "Community Certificate" },
  { value: "other", label: "Other Documents" },
];

export function DocumentUpload() {
  const [claimId, setClaimId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".tiff", ".bmp"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const { uploadDocument, processDocument } = useDocuments();
  const ocrService = new OCRService();

  const processFiles = async () => {
    if (!claimId || !documentType) {
      alert("Please select a claim ID and document type");
      return;
    }

    setIsProcessing(true);

    for (const uploadFile of files) {
      if (uploadFile.status !== "pending") continue;

      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "uploading", progress: 25 }
              : f
          )
        );

        // Upload the file to the server
        const uploadedDoc = await uploadDocument(
          uploadFile.file,
          claimId,
          documentType
        );

        // Update status to processing
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "processing", progress: 50 }
              : f
          )
        );

        // Process with OCR service
        const ocrResult = await ocrService.analyzeClaimWithOCR(uploadFile.file);

        // Update document with OCR results
        await processDocument(uploadedDoc.id);

        // Update status to completed
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "completed",
                  progress: 100,
                  result: ocrResult,
                }
              : f
          )
        );
      } catch (error) {
        console.error("Processing error:", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "error",
                  error:
                    error instanceof Error
                      ? error.message
                      : "Processing failed",
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return <FileText className="h-4 w-4" />;
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "uploading":
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="claimId">Claim ID</Label>
          <Input
            id="claimId"
            placeholder="Enter claim ID (e.g., FRA2024001)"
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* File Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: PNG, JPG, JPEG, TIFF, BMP, PDF (max 10MB each)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Uploaded Files ({files.length})
                </h3>
                <Button
                  onClick={processFiles}
                  disabled={isProcessing || !claimId || !documentType}
                  className="ml-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process All Files"
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(uploadFile.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <Badge className={getStatusColor(uploadFile.status)}>
                          {uploadFile.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                      {(uploadFile.status === "uploading" ||
                        uploadFile.status === "processing") && (
                        <Progress
                          value={uploadFile.progress}
                          className="mt-2"
                        />
                      )}

                      {uploadFile.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {uploadFile.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {uploadFile.result && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <p>
                            OCR Confidence:{" "}
                            {(uploadFile.result.ocr.confidence * 100).toFixed(
                              1
                            )}
                            %
                          </p>
                          <p>
                            Entities Found:{" "}
                            {Object.keys(uploadFile.result.entities).length}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(uploadFile.id)}
                      disabled={
                        uploadFile.status === "uploading" ||
                        uploadFile.status === "processing"
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
