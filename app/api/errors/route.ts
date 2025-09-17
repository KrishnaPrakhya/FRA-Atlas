import { NextRequest, NextResponse } from "next/server"
import { ErrorLogger } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Log the client-side error
    await ErrorLogger.logError(new Error(errorData.message), {
      type: "client-side",
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      userAgent: errorData.userAgent,
      url: errorData.url,
      timestamp: errorData.timestamp,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log client error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to log error" },
      { status: 500 }
    )
  }
}