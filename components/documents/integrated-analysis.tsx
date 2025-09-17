"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Brain,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Ruler,
  Shield,
  Target,
  Lightbulb,
  Activity,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  analysis_id: string;
  document_id: string;
  ocr_result: {
    extracted_text: string;
    confidence: number;
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
  };
  dss_recommendation: {
    recommended_action: string;
    confidence: number;
    reasoning: string[];
    risk_score: number;
    risk_level: string;
    risk_factors: Array<{
      type: string;
      severity: string;
      description: string;
      mitigation: string;
    }>;
    precedent_cases: Array<{
      id: string;
      similarity: number;
      outcome: string;
      summary: string;
    }>;
  };
  total_processing_time: number;
  status: string;
}

interface ProcessingStatus {
  document_id: string;
  status: string;
  progress: number;
  message: string;
  estimated_completion?: number;
}

export function IntegratedAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      await processFile(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Processing failed");
      setIsProcessing(false);
    }
  }, []);

  const processFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Generate document ID for WebSocket connection
    const documentId = Math.random().toString(36).substr(2, 9);

    try {
      // Connect to WebSocket for real-time updates
      const ws = new WebSocket(`ws://localhost:8000/ws/${documentId}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === "status_update" &&
            data.document_id === documentId
          ) {
            setProcessingStatus(data.data);
          }
        } catch (e) {
          console.warn("WebSocket message parsing error:", e);
        }
      };

      ws.onerror = (error) => {
        console.warn("WebSocket connection error:", error);
      };

      // Call the integrated analysis endpoint
      const response = await fetch("http://localhost:8000/analyze-claim", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setIsProcessing(false);

      ws.close();
    } catch (error) {
      let errorMessage = "Processing failed";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Cannot connect to analysis service. Please ensure the backend is running on port 8000.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".tiff", ".bmp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "site_visit":
        return <MapPin className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "site_visit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-orange-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const entityTypeConfig: Record<
    string,
    { icon: any; color: string; label: string }
  > = {
    PERSON: {
      icon: Users,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "Person",
    },
    LOCATION: {
      icon: MapPin,
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Location",
    },
    DATE: {
      icon: Calendar,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      label: "Date",
    },
    AREA: {
      icon: Ruler,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      label: "Area",
    },
    VILLAGE: {
      icon: MapPin,
      color: "bg-teal-100 text-teal-800 border-teal-200",
      label: "Village",
    },
    DISTRICT: {
      icon: MapPin,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      label: "District",
    },
  };

  return (
    <div className="space-y-6">
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
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive
                  ? "Drop document here"
                  : "AI-Powered Claim Analysis"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload forest rights documents for comprehensive OCR + DSS
                analysis
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images (PNG, JPG, TIFF) and PDF files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && processingStatus && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-900">
                  Processing Document
                </h4>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {processingStatus.progress}%
                </Badge>
              </div>
              <Progress value={processingStatus.progress} className="h-3" />
              <p className="text-sm text-blue-800">
                {processingStatus.message}
              </p>
              {processingStatus.estimated_completion && (
                <p className="text-xs text-blue-600">
                  Estimated completion: {processingStatus.estimated_completion}s
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Analysis Complete</h2>
                    <p className="text-sm text-muted-foreground">
                      Processed in{" "}
                      {analysisResult.total_processing_time.toFixed(2)}s
                    </p>
                  </div>
                </CardTitle>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {getActionIcon(
                      analysisResult.dss_recommendation.recommended_action
                    )}
                    <Badge
                      className={getActionColor(
                        analysisResult.dss_recommendation.recommended_action
                      )}
                    >
                      {analysisResult.dss_recommendation.recommended_action
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(
                      analysisResult.dss_recommendation.confidence * 100
                    ).toFixed(1)}
                    % confidence
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ocr">OCR Results</TabsTrigger>
              <TabsTrigger value="dss">DSS Analysis</TabsTrigger>
              <TabsTrigger value="precedents">Precedents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {(analysisResult.ocr_result.confidence * 100).toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-sm text-muted-foreground">
                          OCR Accuracy
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Target className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {(
                            analysisResult.dss_recommendation.confidence * 100
                          ).toFixed(1)}
                          %
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Decision Confidence
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Shield
                        className={`h-8 w-8 ${getRiskColor(
                          analysisResult.dss_recommendation.risk_level
                        )}`}
                      />
                      <div>
                        <div
                          className={`text-2xl font-bold ${getRiskColor(
                            analysisResult.dss_recommendation.risk_level
                          )}`}
                        >
                          {analysisResult.dss_recommendation.risk_level.toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Risk Level
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.dss_recommendation.reasoning
                      .slice(0, 3)
                      .map((reason, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                            {index + 1}
                          </div>
                          <p className="text-sm text-blue-900">{reason}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OCR Results Tab */}
            <TabsContent value="ocr" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm leading-relaxed">
                      {analysisResult.ocr_result.extracted_text}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Extracted Entities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {analysisResult.ocr_result.entities.map((entity, index) => {
                      const config =
                        entityTypeConfig[entity.type] ||
                        entityTypeConfig.PERSON;
                      const Icon = config.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4" />
                            <Badge className={config.color}>
                              {entity.value}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {config.label}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {(entity.confidence * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DSS Analysis Tab */}
            <TabsContent value="dss" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.dss_recommendation.risk_factors.map(
                      (risk, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{risk.type}</h4>
                            <Badge
                              className={
                                risk.severity === "low"
                                  ? "bg-green-100 text-green-800"
                                  : risk.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : risk.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {risk.severity} risk
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {risk.description}
                          </p>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-900 mb-1">
                              Mitigation
                            </h5>
                            <p className="text-sm text-blue-800">
                              {risk.mitigation}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.dss_recommendation.reasoning.map(
                      (reason, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <p className="text-sm p-3 bg-gray-50 rounded-lg flex-1">
                            {reason}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Precedents Tab */}
            <TabsContent value="precedents" className="space-y-4">
              <div className="grid gap-4">
                {analysisResult.dss_recommendation.precedent_cases.map(
                  (precedent) => (
                    <Card key={precedent.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">
                              Case #{precedent.id}
                            </h4>
                            <Badge
                              className={
                                precedent.outcome === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : precedent.outcome === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {precedent.outcome}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-blue-600">
                              {(precedent.similarity * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Similarity
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {precedent.summary}
                        </p>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
