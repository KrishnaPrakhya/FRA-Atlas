import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  userId: string
  email: string
  name: string
  role: "official" | "claimant"
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return null
    }

    const decoded = verify(token.value, JWT_SECRET) as User
    return decoded
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}

export async function requireRole(role: "official" | "claimant"): Promise<User> {
  const user = await requireAuth()

  if (user.role !== role) {
    throw new Error(`${role} role required`)
  }

  return user
}
