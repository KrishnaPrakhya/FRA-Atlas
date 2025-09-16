import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Check if user exists in the users_sync table
    const userQuery = `
      SELECT id, email, name FROM neon_auth.users_sync 
      WHERE email = $1 AND deleted_at IS NULL
    `
    const userResult = await executeQuery(userQuery, [email])

    if (!userResult.success || userResult.data.length === 0) {
      // For demo purposes, create a user if they don't exist
      if (email === "official@fra.gov.in" || email === "claimant@example.com") {
        const createUserQuery = `
          INSERT INTO neon_auth.users_sync (id, email, name, created_at, updated_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING id, email, name
        `
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const name = email === "official@fra.gov.in" ? "Forest Official" : "Forest Claimant"

        const createResult = await executeQuery(createUserQuery, [userId, email, name])

        if (!createResult.success) {
          return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
        }
      } else {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
      }
    }

    // For demo purposes, accept password123 for demo accounts
    if (password !== "password123") {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Get user data (either existing or newly created)
    const finalUserResult = await executeQuery(userQuery, [email])
    const user = finalUserResult.data[0]

    // Check if user is an official
    const officialQuery = `
      SELECT * FROM officials WHERE user_id = $1 AND is_active = true
    `
    const officialResult = await executeQuery(officialQuery, [user.id])
    const isOfficial = officialResult.success && officialResult.data.length > 0

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: isOfficial ? "official" : "claimant",
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: isOfficial ? "official" : "claimant",
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
