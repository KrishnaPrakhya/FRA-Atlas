import { type NextRequest, NextResponse } from "next/server"
import { blockchainClient } from "@/lib/blockchain"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const { claimId, eventType, eventData } = await request.json()

    if (!claimId || !eventType || !eventData) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get claim details
    const claim = await prisma.forestRightsClaim.findUnique({
      where: { id: claimId },
    })

    if (!claim) {
      return NextResponse.json({ success: false, error: "Claim not found" }, { status: 404 })
    }

    let transaction

    switch (eventType) {
      case "CLAIM_SUBMITTED":
        transaction = await blockchainClient.recordClaimSubmission(claimId, {
          claimNumber: claim.claimNumber,
          claimantName: claim.claimantName,
          submissionDate: claim.submissionDate,
          forestAreaHectares: claim.forestAreaHectares,
        })
        break

      case "DECISION_RECORDED":
        transaction = await blockchainClient.recordDecision(claimId, {
          status: eventData.status,
          officialId: user.id,
          decisionDate: new Date(),
          reasoning: eventData.reasoning,
        })
        break

      case "DOCUMENT_VERIFIED":
        transaction = await blockchainClient.recordDocumentVerification(claimId, eventData)
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid event type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionHash: transaction.transactionHash,
        blockNumber: transaction.blockNumber,
        eventType: transaction.eventType,
        timestamp: transaction.timestamp,
      },
    })
  } catch (error) {
    console.error("Blockchain record API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to record blockchain transaction",
      },
      { status: 500 },
    )
  }
}
