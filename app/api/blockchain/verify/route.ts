import { type NextRequest, NextResponse } from "next/server"
import { blockchainClient } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { transactionHash } = await request.json()

    if (!transactionHash) {
      return NextResponse.json({ success: false, error: "Transaction hash required" }, { status: 400 })
    }

    const isValid = await blockchainClient.verifyTransaction(transactionHash)

    return NextResponse.json({
      success: true,
      data: {
        transactionHash,
        isValid,
        verified: isValid,
      },
    })
  } catch (error) {
    console.error("Blockchain verify API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify transaction",
      },
      { status: 500 },
    )
  }
}
