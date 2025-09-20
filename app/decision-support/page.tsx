"use client";

import React, { useState } from "react";
import { DecisionSupportDashboard } from "@/components/decision/decision-support-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  FileText,
  Target,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";

// Mock data for demonstration
const mockRecommendation = {
  id: "rec-001",
  claimId: "claim-2024-001",
  recommendedAction: "approve" as const,
  confidence: 0.87,
  reasoning: [
    "Applicant has provided comprehensive documentation including land records, identity proof, and traditional use evidence",
    "GPS coordinates match with forest survey records and fall within the designated community forest rights area",
    "Similar claims in the same village have been approved with 85% success rate based on precedent analysis",
    "Risk assessment shows low probability of land disputes as the claimed area is not overlapping with any existing rights",
    "Community verification confirms the applicant's family has been using this land for traditional agriculture for over 40 years",
  ],
  factors: [
    {
      id: "f1",
      name: "Documentation Completeness",
      weight: 0.25,
      value: 0.92,
      impact: "positive" as const,
      description: "All required documents submitted with proper verification",
    },
    {
      id: "f2",
      name: "Traditional Use Evidence",
      weight: 0.3,
      value: 0.88,
      impact: "positive" as const,
      description: "Strong evidence of traditional use for over 40 years",
    },
    {
      id: "f3",
      name: "Community Support",
      weight: 0.2,
      value: 0.95,
      impact: "positive" as const,
      description: "Unanimous support from village community and gram sabha",
    },
    {
      id: "f4",
      name: "Environmental Impact",
      weight: 0.15,
      value: 0.75,
      impact: "neutral" as const,
      description: "Minimal environmental impact with sustainable practices",
    },
    {
      id: "f5",
      name: "Legal Compliance",
      weight: 0.1,
      value: 0.9,
      impact: "positive" as const,
      description: "Fully compliant with Forest Rights Act provisions",
    },
  ],
  riskFactors: [
    {
      id: "r1",
      type: "Land Dispute Risk",
      severity: "low" as const,
      description: "Potential boundary disputes with neighboring claimants",
      mitigation:
        "Conduct joint survey with neighboring claimants and establish clear boundaries",
      probability: 0.15,
    },
    {
      id: "r2",
      type: "Environmental Concern",
      severity: "medium" as const,
      description: "Area includes some ecologically sensitive zones",
      mitigation:
        "Implement sustainable land use practices and regular monitoring",
      probability: 0.35,
    },
  ],
  precedentCases: [
    {
      id: "case-001",
      similarity: 0.92,
      outcome: "approved",
      factors: [],
      date: "2024-01-15",
      summary:
        "Similar claim in Ramgarh village approved for 2.3 hectares with strong community support",
    },
    {
      id: "case-002",
      similarity: 0.88,
      outcome: "approved",
      factors: [],
      date: "2024-02-20",
      summary:
        "Traditional agriculture claim approved with comprehensive documentation",
    },
    {
      id: "case-003",
      similarity: 0.85,
      outcome: "approved",
      factors: [],
      date: "2024-03-10",
      summary: "Community forest rights granted with environmental safeguards",
    },
  ],
  createdAt: new Date().toISOString(),
};

const mockAnalytics = {
  totalClaims: 1247,
  pendingDecisions: 89,
  approvalRate: 73.2,
  avgProcessingTime: 18.5,
  riskDistribution: {
    low: 45,
    medium: 32,
    high: 18,
    critical: 5,
  },
  recentDecisions: [
    {
      id: 1,
      claimId: "CLM-001",
      decision: "approved",
      confidence: 0.91,
      date: "2024-03-15",
    },
    {
      id: 2,
      claimId: "CLM-002",
      decision: "rejected",
      confidence: 0.88,
      date: "2024-03-14",
    },
    {
      id: 3,
      claimId: "CLM-003",
      decision: "approved",
      confidence: 0.85,
      date: "2024-03-14",
    },
    {
      id: 4,
      claimId: "CLM-004",
      decision: "site_visit",
      confidence: 0.72,
      date: "2024-03-13",
    },
    {
      id: 5,
      claimId: "CLM-005",
      decision: "approved",
      confidence: 0.89,
      date: "2024-03-13",
    },
  ],
};

export default function DecisionSupportPage() {
  const [activeTab, setActiveTab] = useState("current");

  const handleDecisionMade = (decision: string, reasoning: string) => {
    console.log("Decision made:", decision, reasoning);
    // Here you would typically send this to your backend
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Decision Support System</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered recommendations for forest rights claim decisions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            System Active
          </Badge>
          <Badge variant="outline">v2.1.0</Badge>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockAnalytics.totalClaims}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Claims
                </div>
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
                  {mockAnalytics.pendingDecisions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Decisions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockAnalytics.approvalRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Approval Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockAnalytics.avgProcessingTime}
                </div>
                <div className="text-sm text-muted-foreground">Avg Days</div>
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
          <TabsTrigger value="current" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Current Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Decision Queue</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Current Analysis Tab */}
        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Claim Analysis - {mockRecommendation.claimId}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Demo Analysis:</strong> This shows a comprehensive AI
                  analysis of a forest rights claim. The system evaluates
                  multiple factors, assesses risks, and provides data-driven
                  recommendations based on historical precedents and policy
                  compliance.
                </p>
              </div>
              <DecisionSupportDashboard
                recommendation={mockRecommendation}
                onDecisionMade={handleDecisionMade}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Queue Tab */}
        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.recentDecisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{decision.claimId}</div>
                        <div className="text-sm text-muted-foreground">
                          Submitted on{" "}
                          {new Date(decision.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {(decision.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                      <Badge
                        className={
                          decision.decision === "approved"
                            ? "bg-green-100 text-green-800"
                            : decision.decision === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {decision.decision.replace("_", " ")}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockAnalytics.riskDistribution).map(
                    ([level, count]) => (
                      <div
                        key={level}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              level === "low"
                                ? "text-green-500"
                                : level === "medium"
                                ? "text-yellow-500"
                                : level === "high"
                                ? "text-orange-500"
                                : "text-red-500"
                            }`}
                          />
                          <span className="capitalize">{level} Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                level === "low"
                                  ? "bg-green-500"
                                  : level === "medium"
                                  ? "bg-yellow-500"
                                  : level === "high"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${(count / 100) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium">{count}%</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Decision Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Prediction Accuracy
                    </span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Processing Speed
                    </span>
                    <span className="font-medium">2.3s avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      User Satisfaction
                    </span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Uptime
                    </span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnalytics.recentDecisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {decision.decision === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : decision.decision === "rejected" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <div className="font-medium">{decision.claimId}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(decision.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {(decision.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
