"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Sparkles, Brain } from "lucide-react"
import { aiClient } from "@/lib/ai-client"

interface AnalysisResult {
  claimId: number
  claimNumber: string
  claimantName: string
  overallScore: number
  factors: {
    environmental: number
    social: number
    legal: number
    documentation: number
  }
  recommendation: string
  confidence: number
  riskFactors: string[]
  strengths: string[]
}

export function ClaimAnalysis() {
  const [selectedClaim, setSelectedClaim] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [availableClaims, setAvailableClaims] = useState<any[]>([])

  useEffect(() => {
    fetchAvailableClaims()
  }, [])

  const fetchAvailableClaims = async () => {
    try {
      const response = await fetch("/api/claims?status=pending,under_review")
      const result = await response.json()
      if (result.success) {
        setAvailableClaims(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch claims:", error)
    }
  }

  const analyzeClaimWithAI = async () => {
    if (!selectedClaim) return

    setLoading(true)
    try {
      // Get AI decision support
      const factors = {
        environmental_impact: 0.75,
        social_dependency: 0.85,
        legal_compliance: 0.9,
        document_completeness: 0.8,
      }

      const aiResult = await aiClient.getDecisionSupport(Number.parseInt(selectedClaim), factors)

      // Transform AI result to our analysis format
      const analysisData: AnalysisResult = {
        claimId: Number.parseInt(selectedClaim),
        claimNumber: `FRA2024${selectedClaim.padStart(3, "0")}`,
        claimantName: "Sample Claimant",
        overallScore: aiResult.confidence * 100,
        factors: {
          environmental: factors.environmental_impact * 100,
          social: factors.social_dependency * 100,
          legal: factors.legal_compliance * 100,
          documentation: factors.document_completeness * 100,
        },
        recommendation: aiResult.recommendation,
        confidence: aiResult.confidence * 100,
        riskFactors: aiResult.risk_factors,
        strengths: aiResult.reasoning,
      }

      setAnalysisResult(analysisData)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "APPROVE":
        return "bg-green-100 text-green-800"
      case "CONDITIONAL_APPROVE":
        return "bg-yellow-100 text-yellow-800"
      case "REJECT":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-500"
    if (score >= 60) return "from-amber-500 to-orange-500"
    return "from-red-500 to-rose-500"
  }

  return (
    <div className="space-y-6">
      {/* Claim Selection */}
      <div className="flex items-end space-x-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="claimSelect" className="text-sm font-medium text-foreground/80">
            Select Claim for Analysis
          </Label>
          <Select value={selectedClaim} onValueChange={setSelectedClaim}>
            <SelectTrigger className="glass border-0 bg-white/10 backdrop-blur-md">
              <SelectValue placeholder="Choose a claim to analyze" />
            </SelectTrigger>
            <SelectContent className="glass border-0 bg-white/95 backdrop-blur-md">
              {availableClaims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id.toString()}>
                  {claim.claim_number} - {claim.claimant_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={analyzeClaimWithAI}
          disabled={!selectedClaim || loading}
          className="min-w-[140px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
        >
          <Brain className="h-4 w-4 mr-2" />
          {loading ? "Analyzing..." : "Analyze Claim"}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <span>AI-Powered Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground/80">Overall Score</span>
                      <span
                        className={`text-3xl font-bold bg-gradient-to-r ${getScoreGradient(analysisResult.overallScore)} bg-clip-text text-transparent`}
                      >
                        {analysisResult.overallScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={analysisResult.overallScore} className="h-3 bg-white/20" />
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full opacity-80"
                        style={{ width: `${analysisResult.overallScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground/80">AI Confidence</span>
                      <span className="text-xl font-semibold text-violet-600">
                        {analysisResult.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={analysisResult.confidence} className="h-3 bg-white/20" />
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-80"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground/80">AI Recommendation</Label>
                    <div className="mt-2">
                      <Badge
                        className={`${getRecommendationColor(analysisResult.recommendation)} backdrop-blur-sm border-0 shadow-md`}
                      >
                        {analysisResult.recommendation.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Label className="text-sm font-medium text-foreground/80">Claim Details</Label>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Claim:</strong> {analysisResult.claimNumber}
                      </p>
                      <p>
                        <strong>Claimant:</strong> {analysisResult.claimantName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factor Analysis */}
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Multi-Factor Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysisResult.factors).map(([factor, score]) => (
                  <div key={factor} className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize text-foreground/80">
                        {factor.replace("_", " ")}
                      </span>
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score.toFixed(1)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={score} className="h-2 bg-white/20" />
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full opacity-70"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">Strengths Identified</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysisResult && !loading && (
        <Card className="glass-card border-0 shadow-xl">
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="relative">
                <BarChart3 className="h-16 w-16 mx-auto text-violet-400 opacity-50" />
                <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Analysis Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Select a claim above to begin comprehensive AI-powered analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
