"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Scale,
  FileText,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Shield,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionFactor {
  id: string;
  name: string;
  weight: number;
  value: number;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

interface RiskFactor {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  mitigation: string;
  probability: number;
}

interface PrecedentCase {
  id: string;
  similarity: number;
  outcome: string;
  factors: DecisionFactor[];
  date: string;
  summary: string;
}

interface DSSRecommendation {
  id: string;
  claimId: string;
  recommendedAction: "approve" | "reject" | "request_more_info" | "site_visit";
  confidence: number;
  reasoning: string[];
  riskFactors: RiskFactor[];
  precedentCases: PrecedentCase[];
  factors: DecisionFactor[];
  createdAt: string;
}

interface DecisionSupportDashboardProps {
  recommendation: DSSRecommendation;
  onDecisionMade?: (decision: string, reasoning: string) => void;
  className?: string;
}

const actionConfig = {
  approve: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Approve Claim",
  },
  reject: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Reject Claim",
  },
  request_more_info: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: FileText,
    label: "Request More Information",
  },
  site_visit: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: MapPin,
    label: "Schedule Site Visit",
  },
};

const severityConfig = {
  low: { color: "bg-green-100 text-green-800", label: "Low Risk" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium Risk" },
  high: { color: "bg-orange-100 text-orange-800", label: "High Risk" },
  critical: { color: "bg-red-100 text-red-800", label: "Critical Risk" },
};

export function DecisionSupportDashboard({
  recommendation,
  onDecisionMade,
  className,
}: DecisionSupportDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [decisionReasoning, setDecisionReasoning] = useState("");

  const actionConfig_item = actionConfig[recommendation.recommendedAction];
  const ActionIcon = actionConfig_item.icon;

  const riskScore = useMemo(() => {
    const weights = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalRisk = recommendation.riskFactors.reduce(
      (sum, risk) => sum + weights[risk.severity] * risk.probability,
      0
    );
    return Math.min(totalRisk / recommendation.riskFactors.length, 4);
  }, [recommendation.riskFactors]);

  const positiveFactors = recommendation.factors.filter(
    (f) => f.impact === "positive"
  );
  const negativeFactors = recommendation.factors.filter(
    (f) => f.impact === "negative"
  );
  const neutralFactors = recommendation.factors.filter(
    (f) => f.impact === "neutral"
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (score: number) => {
    if (score <= 1) return "text-green-600";
    if (score <= 2) return "text-yellow-600";
    if (score <= 3) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Recommendation */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  AI Decision Recommendation
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analysis completed at{" "}
                  {new Date(recommendation.createdAt).toLocaleString()}
                </p>
              </div>
            </CardTitle>
            <div className="text-right">
              <div
                className={cn(
                  "text-2xl font-bold",
                  getConfidenceColor(recommendation.confidence)
                )}
              >
                {(recommendation.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Confidence
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ActionIcon className="h-8 w-8 text-primary" />
              <div>
                <Badge className={actionConfig_item.color} variant="outline">
                  {actionConfig_item.label}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Recommended action based on analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className={cn("text-lg font-bold", getRiskColor(riskScore))}
                >
                  {riskScore.toFixed(1)}/4
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Risk Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {recommendation.precedentCases.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Similar Cases
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="factors">Factors</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="precedents">Precedents</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decision Factors Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Scale className="h-4 w-4" />
                  <span>Decision Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Positive</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {positiveFactors.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Negative</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {negativeFactors.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Neutral</span>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700"
                    >
                      {neutralFactors.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Shield className="h-4 w-4" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    recommendation.riskFactors.reduce((acc, risk) => {
                      acc[risk.severity] = (acc[risk.severity] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([severity, count]) => (
                    <div
                      key={severity}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">
                        {severity} Risk
                      </span>
                      <Badge
                        className={
                          severityConfig[
                            severity as keyof typeof severityConfig
                          ].color
                        }
                      >
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Precedent Analysis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Activity className="h-4 w-4" />
                  <span>Precedent Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendation.precedentCases.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Similar Cases
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {recommendation.precedentCases.length > 0
                        ? (
                            (recommendation.precedentCases.reduce(
                              (sum, c) => sum + c.similarity,
                              0
                            ) /
                              recommendation.precedentCases.length) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Avg Similarity
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
              <div className="grid gap-4">
                {recommendation.reasoning.slice(0, 3).map((reason, index) => (
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

        {/* Decision Factors Tab */}
        <TabsContent value="factors" className="space-y-4">
          <div className="grid gap-4">
            {[
              {
                title: "Positive Factors",
                factors: positiveFactors,
                color: "green",
              },
              {
                title: "Negative Factors",
                factors: negativeFactors,
                color: "red",
              },
              {
                title: "Neutral Factors",
                factors: neutralFactors,
                color: "gray",
              },
            ].map(({ title, factors, color }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {factors.map((factor) => (
                      <div
                        key={factor.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{factor.name}</h4>
                            <Badge
                              variant="outline"
                              className={`text-${color}-600 border-${color}-200`}
                            >
                              Weight: {factor.weight}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {factor.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {factor.value.toFixed(2)}
                          </div>
                          <Progress
                            value={factor.value * 100}
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Factors Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {recommendation.riskFactors.map((risk) => (
              <Card key={risk.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <h4 className="font-medium">{risk.type}</h4>
                        <Badge className={severityConfig[risk.severity].color}>
                          {severityConfig[risk.severity].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {risk.description}
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-1">
                          Mitigation Strategy
                        </h5>
                        <p className="text-sm text-blue-800">
                          {risk.mitigation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold">
                        {(risk.probability * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Probability
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Precedent Cases Tab */}
        <TabsContent value="precedents" className="space-y-4">
          <div className="grid gap-4">
            {recommendation.precedentCases.map((precedent) => (
              <Card key={precedent.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Case #{precedent.id}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(precedent.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {(precedent.similarity * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Similarity
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{precedent.summary}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Outcome:
                    </span>
                    <Badge
                      className={
                        precedent.outcome === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {precedent.outcome}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reasoning Tab */}
        <TabsContent value="reasoning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Reasoning Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendation.reasoning.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Decision Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Make Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={decisionReasoning}
                  onChange={(e) => setDecisionReasoning(e.target.value)}
                  placeholder="Add your reasoning for this decision..."
                  className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      onDecisionMade?.("reject", decisionReasoning)
                    }
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onDecisionMade?.("request_more_info", decisionReasoning)
                    }
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Request Info
                  </Button>
                  <Button
                    onClick={() =>
                      onDecisionMade?.("approve", decisionReasoning)
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
