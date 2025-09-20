"use client";

import React, { useState } from "react";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { OCRResultsDisplay } from "@/components/documents/ocr-results-display";
import { IntegratedAnalysis } from "@/components/documents/integrated-analysis";
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
import { DashboardHeader } from "@/components/dashboard-header";

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
  const [activeTab, setActiveTab] = useState("integrated");

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto py-8 space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-700/50">
              <Brain className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                AI-Powered Document Processing
              </span>
              <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Document Intelligence
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced OCR and NER processing for
              <span className="text-emerald-600 font-semibold">
                {" "}
                forest rights documents
              </span>{" "}
              with
              <span className="text-teal-600 font-semibold">
                {" "}
                AI-powered insights
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FileText className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Multi-language OCR</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Brain className="h-5 w-5 text-teal-500" />
                <span className="text-sm">Entity Recognition</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Zap className="h-5 w-5 text-cyan-500" />
                <span className="text-sm">Real-time Processing</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 pt-6">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                <Share className="h-4 w-4 mr-2 text-emerald-600" />
                <span className="text-emerald-700">Share Results</span>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Documents Card */}
              <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <Eye className="h-5 w-5 text-emerald-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {processedDocuments.length}
                  </div>
                  <div className="text-emerald-100 text-sm">
                    Total Documents
                  </div>
                </CardContent>
              </Card>

              {/* Completed Card */}
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <Zap className="h-5 w-5 text-teal-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {completedDocs.length}
                  </div>
                  <div className="text-teal-100 text-sm">Completed</div>
                </CardContent>
              </Card>

              {/* Processing Card */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div className="h-5 w-5 bg-blue-200 rounded-full animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {processingDocs.length}
                  </div>
                  <div className="text-blue-100 text-sm">Processing</div>
                </CardContent>
              </Card>

              {/* Confidence Card */}
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <CheckCircle className="h-5 w-5 text-purple-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {(totalConfidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-purple-100 text-sm">Avg Confidence</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="relative z-10 p-8 space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Brain className="h-4 w-4" />
                    <span>Processing Center</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                    Document Analysis Hub
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    Choose your processing method and analyze documents with AI
                  </p>
                </div>

                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-emerald-200/30 dark:border-emerald-700/30">
                  <TabsTrigger
                    value="integrated"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <Brain className="h-4 w-4" />
                    <span>AI Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>OCR Only</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Results</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="demo"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Demo</span>
                  </TabsTrigger>
                </TabsList>

                {/* Integrated Analysis Tab */}
                <TabsContent value="integrated" className="space-y-8">
                  <Card className="bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-gray-800/80 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                            Complete AI-Powered Analysis
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Comprehensive document processing with decision
                            support
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="flex items-start space-x-3">
                          <Zap className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                              Advanced Analysis Pipeline
                            </p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                              Upload forest rights documents for comprehensive
                              processing that combines OCR text extraction,
                              entity recognition, and AI-powered decision
                              support with risk assessment and precedent
                              analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <IntegratedAnalysis />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Upload Tab */}
                <TabsContent value="upload" className="space-y-8">
                  <Card className="bg-gradient-to-br from-white/80 to-teal-50/80 dark:from-gray-800/80 dark:to-teal-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                            Document Upload & Processing
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            OCR-only processing for text extraction and entity
                            recognition
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <DocumentUploader
                        onFilesUploaded={handleFilesUploaded}
                        maxFiles={10}
                        acceptedFileTypes={["image/*", "application/pdf"]}
                      />
                    </CardContent>
                  </Card>

                  {/* Processing Queue */}
                  {processedDocuments.length > 0 && (
                    <Card className="bg-gradient-to-br from-white/80 to-cyan-50/80 dark:from-gray-800/80 dark:to-cyan-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                            Processing Queue
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          {processedDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                                  <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {doc.filename}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {doc.processingTime &&
                                      `Processed in ${doc.processingTime.toFixed(
                                        2
                                      )}s`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {doc.confidence && (
                                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                                    {(doc.confidence * 100).toFixed(1)}%
                                    confidence
                                  </Badge>
                                )}
                                <Badge
                                  className={
                                    doc.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-700"
                                      : doc.status === "processing"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-700"
                                  }
                                >
                                  {doc.status}
                                </Badge>
                                {doc.status === "completed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                                    onClick={() => {
                                      setSelectedDocument(doc);
                                      setActiveTab("results");
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2 text-emerald-600" />
                                    <span className="text-emerald-700">
                                      View Results
                                    </span>
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
                <TabsContent value="results" className="space-y-8">
                  {selectedDocument?.ocrResult ? (
                    <Card className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="relative z-10 pb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                              Analysis Results
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              Detailed OCR and entity extraction results
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <OCRResultsDisplay
                          result={selectedDocument.ocrResult}
                          onEntityVerify={(entityId, verified) => {
                            console.log(
                              "Entity verification:",
                              entityId,
                              verified
                            );
                          }}
                          onTextEdit={(newText) => {
                            console.log("Text edited:", newText);
                          }}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-16 text-center">
                        <div className="space-y-6">
                          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/20 dark:to-gray-800/20 rounded-3xl inline-block">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                              No Results Selected
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                              Upload and process documents to view OCR results,
                              or select a completed document from the processing
                              queue.
                            </p>
                          </div>
                          <Button
                            onClick={() => setActiveTab("upload")}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Start Processing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="demo" className="space-y-8">
                  <Card className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/20 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10 pb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                            Live Demo - Forest Rights Document Analysis
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Interactive demonstration of our AI processing
                            capabilities
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">
                              Interactive Demo
                            </p>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              This shows a sample forest rights claim document
                              that has been processed with our advanced OCR and
                              NER system. The system automatically extracts key
                              information like applicant names, locations,
                              areas, and other relevant entities.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <OCRResultsDisplay
                        result={mockOCRResult}
                        onEntityVerify={(entityId, verified) => {
                          console.log(
                            "Demo entity verification:",
                            entityId,
                            verified
                          );
                        }}
                        onTextEdit={(newText) => {
                          console.log("Demo text edited:", newText);
                        }}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Brain className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                Powered by advanced AI for intelligent document processing
              </span>
              <Zap className="h-5 w-5 text-teal-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
