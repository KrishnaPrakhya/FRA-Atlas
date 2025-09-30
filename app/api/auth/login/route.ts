
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken, generateRefreshToken, verifyPassword } from "@/lib/auth"
import { serialize } from "cookie"
import { success } from "zod"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log('User found:', user)
    console.log('Attempting password:', password)
    console.log('Stored hash:', user.password)

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const accessToken = generateToken({ userId: user.id, email: user.email, role: user.role })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role })

    const accessTokenCookie = serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    })

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    const headers = new Headers()
    headers.append("Set-Cookie", accessTokenCookie)
    headers.append("Set-Cookie", refreshTokenCookie)

    return NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200, headers }
    )
  } catch (error) {
    console.log('Password valid?:')
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
