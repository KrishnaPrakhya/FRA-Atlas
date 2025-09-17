import { NextRequest, NextResponse } from "next/server"
import { withErrorHandler, AuthenticationError } from "@/lib/error-handler"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const GET = withErrorHandler(async (request: NextRequest) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value

    if (!token) {
      throw new AuthenticationError("No authentication token provided")
    }

    // Verify and decode the token
    const decoded = await verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      throw new AuthenticationError("Invalid authentication token")
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            avatar: true,
            language: true,
            timezone: true,
          },
        },
      },
    })

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    throw error
  }
})