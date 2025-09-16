"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Brain, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface Recommendation {
  id: string
  claimId: number
  claimNumber: string
  claimantName: string
  recommendation: "APPROVE" | "CONDITIONAL_APPROVE" | "REJECT"
  confidence: number
  reasoning: string[]
  riskFactors: string[]
  priority: "High" | "Medium" | "Low"
  estimatedProcessingTime: number
  lastUpdated: string
}

export function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/decision/recommendations")
      const result = await response.json()

      if (result.success) {
        setRecommendations(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshRecommendations = async () => {
    setRefreshing(true)
    await fetchRecommendations()
    setRefreshing(false)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "APPROVE":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "CONDITIONAL_APPROVE":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "REJECT":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span className="font-semibold">AI-Generated Recommendations</span>
        </div>
        <Button variant="outline" size="sm" onClick={refreshRecommendations} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRecommendationIcon(rec.recommendation)}
                  <div>
                    <CardTitle className="text-lg">{rec.claimNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{rec.claimantName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
                  <Badge className={getRecommendationColor(rec.recommendation)}>
                    {rec.recommendation.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Confidence Level</span>
                  <span className="font-medium">{rec.confidence.toFixed(1)}%</span>
                </div>
                <Progress value={rec.confidence} className="h-2" />
              </div>

              <Separator />

              {/* Reasoning */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Key Reasoning</h4>
                <ul className="space-y-1">
                  {rec.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors */}
              {rec.riskFactors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-red-700">Risk Considerations</h4>
                  <ul className="space-y-1">
                    {rec.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Action Items */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Est. Processing Time: </span>
                  <span className="font-medium">{rec.estimatedProcessingTime} days</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Apply Recommendation</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-semibold">No Recommendations Available</h3>
                <p className="text-sm text-muted-foreground">
                  AI recommendations will appear here as claims are processed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
