"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  MapPin,
  Calendar,
  Ruler,
  Phone,
  Building,
  Hash,
  Eye,
  Edit3,
  Download,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedEntity {
  id: string;
  type: string;
  value: string;
  confidence: number;
  start_index: number;
  end_index: number;
  verified: boolean;
}

interface OCRResult {
  id: string;
  document_id: string;
  extracted_text: string;
  confidence: number;
  language: string;
  processing_time: number;
  entities: ExtractedEntity[];
  status: string;
  created_at: string;
}

interface OCRResultsDisplayProps {
  result: OCRResult;
  onEntityVerify?: (entityId: string, verified: boolean) => void;
  onTextEdit?: (newText: string) => void;
  className?: string;
}

const entityTypeConfig = {
  PERSON: {
    icon: User,
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
  PHONE: {
    icon: Phone,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    label: "Phone",
  },
  VILLAGE: {
    icon: Building,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    label: "Village",
  },
  DISTRICT: {
    icon: Building,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    label: "District",
  },
  SURVEY_NUMBER: {
    icon: Hash,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Survey No.",
  },
  ORG: {
    icon: Building,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    label: "Organization",
  },
  GPE: {
    icon: MapPin,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    label: "Place",
  },
};

export function OCRResultsDisplay({
  result,
  onEntityVerify,
  onTextEdit,
  className,
}: OCRResultsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(result.extracted_text);
  const [copiedEntity, setCopiedEntity] = useState<string | null>(null);

  const entityStats = useMemo(() => {
    const stats = result.entities.reduce((acc, entity) => {
      acc[entity.type] = (acc[entity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  }, [result.entities]);

  const averageConfidence = useMemo(() => {
    if (result.entities.length === 0) return 0;
    return (
      result.entities.reduce((sum, entity) => sum + entity.confidence, 0) /
      result.entities.length
    );
  }, [result.entities]);

  const highlightedText = useMemo(() => {
    let text = result.extracted_text;
    const sortedEntities = [...result.entities].sort(
      (a, b) => b.start_index - a.start_index
    );

    sortedEntities.forEach((entity) => {
      const config =
        entityTypeConfig[entity.type as keyof typeof entityTypeConfig] ||
        entityTypeConfig.ORG;
      const beforeText = text.substring(0, entity.start_index);
      const entityText = text.substring(entity.start_index, entity.end_index);
      const afterText = text.substring(entity.end_index);

      const highlightClass = `inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${config.color} cursor-pointer hover:opacity-80 transition-opacity`;

      text =
        beforeText +
        `<span class="${highlightClass}" data-entity-id="${entity.id}" title="${
          entity.type
        }: ${entity.confidence.toFixed(2)} confidence">${entityText}</span>` +
        afterText;
    });

    return text;
  }, [result.extracted_text, result.entities]);

  const handleEntityClick = (entityId: string) => {
    const entity = result.entities.find((e) => e.id === entityId);
    if (entity) {
      onEntityVerify?.(entityId, !entity.verified);
    }
  };

  const handleCopyEntity = async (entity: ExtractedEntity) => {
    await navigator.clipboard.writeText(entity.value);
    setCopiedEntity(entity.id);
    setTimeout(() => setCopiedEntity(null), 2000);
  };

  const handleSaveEdit = () => {
    onTextEdit?.(editedText);
    setIsEditing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <Check className="h-3 w-3" />;
    if (confidence >= 0.6) return <AlertTriangle className="h-3 w-3" />;
    return <AlertTriangle className="h-3 w-3" />;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>OCR Analysis Results</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {result.language.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {result.processing_time.toFixed(2)}s
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(result.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">OCR Confidence</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {result.entities.length}
              </div>
              <div className="text-sm text-green-700">Entities Found</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(averageConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-purple-700">
                Avg Entity Confidence
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {result.extracted_text.split(" ").length}
              </div>
              <div className="text-sm text-orange-700">Words Extracted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="text" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Extracted Text</TabsTrigger>
          <TabsTrigger value="entities">
            Entities ({result.entities.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Extracted Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Extracted Text</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-64 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Edit extracted text..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose max-w-none p-4 bg-gray-50 rounded-lg border leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(entityStats).map(([type, count]) => {
              const config =
                entityTypeConfig[type as keyof typeof entityTypeConfig] ||
                entityTypeConfig.ORG;
              const Icon = config.icon;
              const entitiesOfType = result.entities.filter(
                (e) => e.type === type
              );

              return (
                <Card key={type}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Icon className="h-4 w-4" />
                      <span>{config.label}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {entitiesOfType.map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge className={config.color}>
                              {entity.value}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  getConfidenceColor(entity.confidence)
                                )}
                              >
                                {(entity.confidence * 100).toFixed(1)}%
                              </span>
                              {getConfidenceIcon(entity.confidence)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEntity(entity)}
                              className="h-8 w-8 p-0"
                            >
                              {copiedEntity === entity.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant={entity.verified ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleEntityClick(entity.id)}
                            >
                              {entity.verified ? "Verified" : "Verify"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confidence Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(entityStats).map(([type, count]) => {
                    const config =
                      entityTypeConfig[type as keyof typeof entityTypeConfig] ||
                      entityTypeConfig.ORG;
                    const avgConfidence =
                      result.entities
                        .filter((e) => e.type === type)
                        .reduce((sum, e) => sum + e.confidence, 0) / count;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center space-x-2">
                            <config.icon className="h-3 w-3" />
                            <span>{config.label}</span>
                          </span>
                          <span className={getConfidenceColor(avgConfidence)}>
                            {(avgConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={avgConfidence * 100} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Processing Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Processing Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Processing Time
                    </span>
                    <span className="font-medium">
                      {result.processing_time.toFixed(2)}s
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Characters Extracted
                    </span>
                    <span className="font-medium">
                      {result.extracted_text.length}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Words Extracted
                    </span>
                    <span className="font-medium">
                      {result.extracted_text.split(" ").length}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Entities per Word
                    </span>
                    <span className="font-medium">
                      {(
                        result.entities.length /
                        result.extracted_text.split(" ").length
                      ).toFixed(3)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
