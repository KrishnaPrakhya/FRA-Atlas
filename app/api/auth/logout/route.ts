import { NextRequest, NextResponse } from "next/server"
import { withErrorHandler } from "@/lib/error-handler"

export const POST = withErrorHandler(async (request: NextRequest) => {
  try {
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    })

    // Set cookies to expire immediately
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    response.cookies.set("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    throw error
  }
})