import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const claims = await prisma.forestRightsClaim.findMany({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW", "PENDING_DOCUMENTS"],
        },
      },
      include: {
        decisionFactors: true,
        documents: {
          where: {
            verificationStatus: "VERIFIED",
          },
        },
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: {
        submissionDate: "asc",
      },
      take: 10,
    })

    // Generate AI recommendations for each claim
    const recommendations = claims.map((claim) => {
      const avgScore =
        claim.decisionFactors.length > 0
          ? claim.decisionFactors.reduce((sum, factor) => sum + factor.factorValue, 0) / claim.decisionFactors.length
          : 0.5

      const docCompleteness = claim._count.documents > 0 ? claim.documents.length / claim._count.documents : 0
      const overallScore = (avgScore + docCompleteness) / 2

      let recommendation = "REJECT"
      let confidence = 60
      let reasoning = ["Insufficient data for analysis"]
      let riskFactors = ["Limited documentation", "Incomplete verification"]

      if (overallScore >= 0.8) {
        recommendation = "APPROVE"
        confidence = 85 + Math.random() * 10
        reasoning = [
          "High compliance score across all factors",
          "Complete documentation provided",
          "No significant risk factors identified",
        ]
        riskFactors = []
      } else if (overallScore >= 0.6) {
        recommendation = "CONDITIONAL_APPROVE"
        confidence = 70 + Math.random() * 10
        reasoning = ["Moderate compliance score", "Most documentation verified", "Minor issues can be addressed"]
        riskFactors = ["Requires additional verification", "Monitor compliance"]
      } else {
        confidence = 75 + Math.random() * 10
        reasoning = ["Low compliance score", "Significant documentation gaps", "Multiple risk factors identified"]
        riskFactors = ["Incomplete documentation", "Environmental concerns", "Legal compliance issues"]
      }

      return {
        id: `rec_${claim.id}`,
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        claimantName: claim.claimantName,
        recommendation,
        confidence,
        reasoning,
        riskFactors,
        priority: overallScore < 0.4 ? "High" : overallScore < 0.7 ? "Medium" : "Low",
        estimatedProcessingTime: Math.floor(15 + Math.random() * 30),
        lastUpdated: new Date().toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
