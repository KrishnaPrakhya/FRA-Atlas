"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  ocrResult?: any;
  error?: string;
}

interface DocumentUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export function DocumentUploader({
  onFilesUploaded,
  maxFiles = 10,
  acceptedFileTypes = ["image/*", "application/pdf"],
  className,
}: DocumentUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        status: "uploading",
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsProcessing(true);

      // Process each file
      for (const uploadedFile of newFiles) {
        try {
          await processFile(uploadedFile);
        } catch (error) {
          updateFileStatus(
            uploadedFile.id,
            "error",
            0,
            undefined,
            error instanceof Error ? error.message : "Processing failed"
          );
        }
      }

      setIsProcessing(false);
      onFilesUploaded?.(uploadedFiles);
    },
    [uploadedFiles, onFilesUploaded]
  );

  const processFile = async (uploadedFile: UploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile.file);

    // Connect to WebSocket for real-time updates
    const ws = new WebSocket(`ws://localhost:8000/ws/${uploadedFile.id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === "status_update" &&
          data.document_id === uploadedFile.id
        ) {
          const status = data.data;
          updateFileStatus(
            uploadedFile.id,
            status.status === "completed" ? "completed" : "processing",
            status.progress,
            status.status === "completed" ? data.result : undefined,
            status.message
          );
        }
      } catch (e) {
        console.warn("WebSocket message parsing error:", e);
      }
    };

    ws.onerror = (error) => {
      console.warn("WebSocket connection error:", error);
      // Continue with HTTP-only processing
    };

    try {
      const response = await fetch("http://localhost:8000/ocr/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      updateFileStatus(uploadedFile.id, "completed", 100, result);
    } catch (error) {
      let errorMessage = "Processing failed";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Cannot connect to OCR service. Please ensure the backend is running on port 8000.";
        } else {
          errorMessage = error.message;
        }
      }

      updateFileStatus(uploadedFile.id, "error", 0, undefined, errorMessage);
    } finally {
      ws.close();
    }
  };

  const updateFileStatus = (
    id: string,
    status: UploadedFile["status"],
    progress: number,
    ocrResult?: any,
    error?: string
  ) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status, progress, ocrResult, error } : file
      )
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxFiles,
    disabled: isProcessing,
  });

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        );
    }
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      <Card className="border-2 border-dashed transition-all duration-200 hover:border-primary/50">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all duration-200",
              isDragActive && "scale-105",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? "Drop files here" : "Upload Documents"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images and PDFs • Max {maxFiles} files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Uploaded Documents</h4>
          <div className="grid gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {uploadedFile.preview ? (
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                          <File className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium truncate">
                          {uploadedFile.file.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={getStatusColor(uploadedFile.status)}
                          >
                            {uploadedFile.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span>•</span>
                        <span>{uploadedFile.file.type}</span>
                      </div>

                      {/* Progress Bar */}
                      {uploadedFile.status !== "completed" &&
                        uploadedFile.status !== "error" && (
                          <div className="space-y-1">
                            <Progress
                              value={uploadedFile.progress}
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              {uploadedFile.progress}% complete
                            </p>
                          </div>
                        )}

                      {/* Error Message */}
                      {uploadedFile.error && (
                        <p className="text-xs text-red-600">
                          {uploadedFile.error}
                        </p>
                      )}

                      {/* Action Buttons */}
                      {uploadedFile.status === "completed" &&
                        uploadedFile.ocrResult && (
                          <div className="flex items-center space-x-2 pt-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Results
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(uploadedFile.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processing Summary */}
      {isProcessing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Processing documents...
                </p>
                <p className="text-xs text-blue-700">
                  Using advanced OCR and NER to extract text and entities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
