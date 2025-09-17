"use client";

import React, { useState } from "react";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { OCRResultsDisplay } from "@/components/documents/ocr-results-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Download,
  Share,
} from "lucide-react";

interface ProcessedDocument {
  id: string;
  filename: string;
  status: "processing" | "completed" | "error";
  ocrResult?: any;
  processingTime?: number;
  confidence?: number;
}

export default function DocumentProcessingPage() {
  const [processedDocuments, setProcessedDocuments] = useState<
    ProcessedDocument[]
  >([]);
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFilesUploaded = (files: any[]) => {
    const newDocs = files.map((file) => ({
      id: file.id,
      filename: file.file.name,
      status: file.status,
      ocrResult: file.ocrResult,
      processingTime: file.ocrResult?.processing_time,
      confidence: file.ocrResult?.confidence,
    }));
    setProcessedDocuments((prev) => [...prev, ...newDocs]);
  };

  const completedDocs = processedDocuments.filter(
    (doc) => doc.status === "completed"
  );
  const processingDocs = processedDocuments.filter(
    (doc) => doc.status === "processing"
  );
  const totalConfidence =
    completedDocs.length > 0
      ? completedDocs.reduce((sum, doc) => sum + (doc.confidence || 0), 0) /
        completedDocs.length
      : 0;

  // Mock OCR result for demonstration
  const mockOCRResult = {
    id: "mock-1",
    document_id: "doc-1",
    extracted_text:
      "Forest Rights Claim Application\n\nApplicant Name: राम कुमार शर्मा (Ram Kumar Sharma)\nVillage: Ramgarh\nDistrict: Ranchi\nState: Jharkhand\nPhone: +91 9876543210\nArea Claimed: 2.5 hectares\nSurvey Number: 123/4\nDate of Application: 15/03/2024\n\nI, Ram Kumar Sharma, son of Shyam Lal Sharma, resident of Village Ramgarh, hereby apply for recognition of forest rights under the Forest Rights Act, 2006. My family has been traditionally using this forest land for agriculture and collection of minor forest produce for the past 50 years.",
    confidence: 0.92,
    language: "multi",
    processing_time: 3.45,
    entities: [
      {
        id: "e1",
        type: "PERSON",
        value: "राम कुमार शर्मा (Ram Kumar Sharma)",
        confidence: 0.95,
        start_index: 45,
        end_index: 78,
        verified: false,
      },
      {
        id: "e2",
        type: "VILLAGE",
        value: "Ramgarh",
        confidence: 0.88,
        start_index: 88,
        end_index: 95,
        verified: false,
      },
      {
        id: "e3",
        type: "DISTRICT",
        value: "Ranchi",
        confidence: 0.91,
        start_index: 106,
        end_index: 112,
        verified: false,
      },
      {
        id: "e4",
        type: "PHONE",
        value: "+91 9876543210",
        confidence: 0.97,
        start_index: 140,
        end_index: 154,
        verified: false,
      },
      {
        id: "e5",
        type: "AREA",
        value: "2.5 hectares",
        confidence: 0.89,
        start_index: 170,
        end_index: 182,
        verified: false,
      },
      {
        id: "e6",
        type: "SURVEY_NUMBER",
        value: "123/4",
        confidence: 0.93,
        start_index: 200,
        end_index: 205,
        verified: false,
      },
      {
        id: "e7",
        type: "DATE",
        value: "15/03/2024",
        confidence: 0.96,
        start_index: 230,
        end_index: 240,
        verified: false,
      },
    ],
    status: "completed",
    created_at: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Processing Center</h1>
          <p className="text-muted-foreground mt-2">
            Advanced OCR and NER processing for forest rights documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {processedDocuments.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Documents
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{completedDocs.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {processingDocs.length}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {(totalConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Confidence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Upload & Process</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Results</span>
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Live Demo</span>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Document Upload & Processing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUploader
                onFilesUploaded={handleFilesUploaded}
                maxFiles={10}
                acceptedFileTypes={["image/*", "application/pdf"]}
              />
            </CardContent>
          </Card>

          {/* Processing Queue */}
          {processedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{doc.filename}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.processingTime &&
                              `Processed in ${doc.processingTime.toFixed(2)}s`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.confidence && (
                          <Badge variant="outline">
                            {(doc.confidence * 100).toFixed(1)}% confidence
                          </Badge>
                        )}
                        <Badge
                          className={
                            doc.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {doc.status}
                        </Badge>
                        {doc.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setActiveTab("results");
                            }}
                          >
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {selectedDocument?.ocrResult ? (
            <OCRResultsDisplay
              result={selectedDocument.ocrResult}
              onEntityVerify={(entityId, verified) => {
                console.log("Entity verification:", entityId, verified);
              }}
              onTextEdit={(newText) => {
                console.log("Text edited:", newText);
              }}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Results Selected
                </h3>
                <p className="text-muted-foreground">
                  Upload and process documents to view OCR results, or select a
                  completed document from the processing queue.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Live Demo - Forest Rights Document Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Demo:</strong> This shows a sample forest rights claim
                  document that has been processed with our advanced OCR and NER
                  system. The system automatically extracts key information like
                  applicant names, locations, areas, and other relevant
                  entities.
                </p>
              </div>
              <OCRResultsDisplay
                result={mockOCRResult}
                onEntityVerify={(entityId, verified) => {
                  console.log("Demo entity verification:", entityId, verified);
                }}
                onTextEdit={(newText) => {
                  console.log("Demo text edited:", newText);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
