import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { executeQuery } from "@/lib/database"
import { AlertTriangle, Shield, Clock, FileX } from "lucide-react"

interface RiskFactor {
  id: string
  title: string
  description: string
  severity: "Low" | "Medium" | "High" | "Critical"
  probability: number
  impact: number
  affectedClaims: number
  icon: any
}

export async function RiskAssessment() {
  // Fetch risk assessment data
  const riskQuery = `
    SELECT 
      COUNT(CASE WHEN c.status = 'Pending' AND c.submission_date < CURRENT_DATE - INTERVAL '60 days' THEN 1 END) as overdue_claims,
      COUNT(CASE WHEN d.verification_status = 'Rejected' THEN 1 END) as rejected_documents,
      COUNT(CASE WHEN c.forest_area_hectares > 10 THEN 1 END) as large_area_claims,
      COUNT(CASE WHEN df.factor_value < 0.5 AND df.factor_type = 'Environmental' THEN 1 END) as env_risk_claims
    FROM forest_rights_claims c
    LEFT JOIN claim_documents d ON c.id = d.claim_id
    LEFT JOIN decision_factors df ON c.id = df.claim_id
    WHERE c.status IN ('Pending', 'Under Review')
  `

  const result = await executeQuery(riskQuery)
  const riskData = result.success
    ? result.data[0]
    : {
        overdue_claims: 0,
        rejected_documents: 0,
        large_area_claims: 0,
        env_risk_claims: 0,
      }

  const riskFactors: RiskFactor[] = [
    {
      id: "overdue",
      title: "Processing Delays",
      description: "Claims pending beyond statutory time limits",
      severity: "High",
      probability: 85,
      impact: 90,
      affectedClaims: riskData.overdue_claims || 0,
      icon: Clock,
    },
    {
      id: "documentation",
      title: "Document Verification Issues",
      description: "High rate of document rejections indicating systemic issues",
      severity: "Medium",
      probability: 65,
      impact: 70,
      affectedClaims: riskData.rejected_documents || 0,
      icon: FileX,
    },
    {
      id: "environmental",
      title: "Environmental Compliance Risk",
      description: "Claims with potential environmental impact concerns",
      severity: "Critical",
      probability: 40,
      impact: 95,
      affectedClaims: riskData.env_risk_claims || 0,
      icon: AlertTriangle,
    },
    {
      id: "area_size",
      title: "Large Area Claims",
      description: "Claims involving significant forest area requiring special attention",
      severity: "Medium",
      probability: 30,
      impact: 80,
      affectedClaims: riskData.large_area_claims || 0,
      icon: Shield,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateRiskScore = (probability: number, impact: number) => {
    return (probability * impact) / 100
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskFactors.map((risk) => {
          const Icon = risk.icon
          const riskScore = calculateRiskScore(risk.probability, risk.impact)

          return (
            <Card key={risk.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">{risk.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{risk.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Risk Score</span>
                      <span className="font-medium">{riskScore.toFixed(1)}</span>
                    </div>
                    <Progress value={riskScore} className="h-1" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{risk.affectedClaims}</span> claims affected
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Factor Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {riskFactors.map((risk) => {
              const Icon = risk.icon
              const riskScore = calculateRiskScore(risk.probability, risk.impact)

              return (
                <div key={risk.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{risk.title}</h3>
                        <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{risk.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Probability</span>
                            <span className="font-medium">{risk.probability}%</span>
                          </div>
                          <Progress value={risk.probability} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Impact</span>
                            <span className="font-medium">{risk.impact}%</span>
                          </div>
                          <Progress value={risk.impact} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Risk Score</span>
                            <span className="font-medium">{riskScore.toFixed(1)}</span>
                          </div>
                          <Progress value={riskScore} className="h-2" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Affected Claims: <span className="font-medium">{risk.affectedClaims}</span>
                        </span>
                        <button className="text-primary hover:underline">View Mitigation Plan →</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Immediate Action Required</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Review and expedite processing of overdue claims</li>
                <li>• Conduct environmental impact assessment for high-risk claims</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Improve document verification processes</li>
                <li>• Implement additional checks for large area claims</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Long-term Improvements</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enhance AI-powered risk detection algorithms</li>
                <li>• Develop predictive models for claim processing times</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
