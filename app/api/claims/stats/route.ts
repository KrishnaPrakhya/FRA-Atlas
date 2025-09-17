import { NextRequest, NextResponse } from "next/server"
import { withErrorHandler } from "@/lib/error-handler"
import { prisma } from "@/lib/prisma"

export const GET = withErrorHandler(async (request: NextRequest) => {
  try {
    // Get claims statistics
    const [
      totalClaims,
      submittedClaims,
      underReviewClaims,
      approvedClaims,
      rejectedClaims,
      pendingDocumentsClaims,
    ] = await Promise.all([
      prisma.forestRightsClaim.count(),
      prisma.forestRightsClaim.count({
        where: { status: "SUBMITTED" },
      }),
      prisma.forestRightsClaim.count({
        where: { status: "UNDER_REVIEW" },
      }),
      prisma.forestRightsClaim.count({
        where: { status: "APPROVED" },
      }),
      prisma.forestRightsClaim.count({
        where: { status: "REJECTED" },
      }),
      prisma.forestRightsClaim.count({
        where: { status: "PENDING_DOCUMENTS" },
      }),
    ])

    // Calculate additional metrics
    const pendingClaims = submittedClaims + pendingDocumentsClaims
    const processingClaims = underReviewClaims
    const completedClaims = approvedClaims + rejectedClaims

    // Get claims by district for geographic distribution
    const claimsByDistrict = await prisma.forestRightsClaim.groupBy({
      by: ["district"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    })

    // Get recent activity (claims submitted in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentActivity = await prisma.forestRightsClaim.count({
      where: {
        submissionDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Calculate processing time statistics
    const processingTimes = await prisma.forestRightsClaim.findMany({
      where: {
        status: {
          in: ["APPROVED", "REJECTED"],
        },
        actualCompletionDate: {
          not: null,
        },
      },
      select: {
        submissionDate: true,
        actualCompletionDate: true,
      },
    })

    const avgProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((acc, claim) => {
          const days = Math.floor(
            (new Date(claim.actualCompletionDate!).getTime() - new Date(claim.submissionDate).getTime()) 
            / (1000 * 60 * 60 * 24)
          )
          return acc + days
        }, 0) / processingTimes.length
      : 0

    return NextResponse.json({
      success: true,
      data: {
        total_claims: totalClaims,
        pending_claims: pendingClaims,
        under_review_claims: underReviewClaims,
        approved_claims: approvedClaims,
        rejected_claims: rejectedClaims,
        pending_documents_claims: pendingDocumentsClaims,
        processing_claims: processingClaims,
        completed_claims: completedClaims,
        recent_activity: recentActivity,
        avg_processing_time_days: Math.round(avgProcessingTime),
        claims_by_district: claimsByDistrict.map((item) => ({
          district: item.district,
          count: item._count.id,
        })),
        status_distribution: {
          SUBMITTED: submittedClaims,
          UNDER_REVIEW: underReviewClaims,
          APPROVED: approvedClaims,
          REJECTED: rejectedClaims,
          PENDING_DOCUMENTS: pendingDocumentsClaims,
        },
      },
    })
  } catch (error) {
    throw error
  }
})