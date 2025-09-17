import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { AuthenticationError, AuthorizationError } from "./error-handler"

export interface User {
  id: string
  email: string
  name: string | null
  role: "CLAIMANT" | "OFFICIAL" | "ADMIN"
  createdAt: Date
  updatedAt: Date
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

// Generate JWT token
export function generateToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Generate refresh token
export function generateRefreshToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Invalid token")
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token expired")
    }
    throw new AuthenticationError("Token verification failed")
  }
}

// Verify refresh token
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Invalid refresh token")
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Refresh token expired")
    }
    throw new AuthenticationError("Refresh token verification failed")
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

// Check if user has required permission
export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const rolePermissions: Record<string, string[]> = {
    ADMIN: [
      "claims:read",
      "claims:write",
      "claims:delete",
      "users:read",
      "users:write",
      "users:delete",
      "documents:read",
      "documents:write",
      "documents:delete",
      "analytics:read",
      "system:admin",
    ],
    OFFICIAL: [
      "claims:read",
      "claims:write",
      "documents:read",
      "documents:write",
      "analytics:read",
      "workflow:manage",
    ],
    CLAIMANT: [
      "claims:read:own",
      "claims:write:own",
      "documents:read:own",
      "documents:write:own",
    ],
  }

  const permissions = rolePermissions[userRole] || []
  return permissions.includes(requiredPermission)
}

// Middleware to check authentication
export function requireAuth(requiredRoles?: string[]) {
  return async (token: string | undefined): Promise<TokenPayload> => {
    if (!token) {
      throw new AuthenticationError("Authentication required")
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      throw new AuthenticationError("Invalid authentication token")
    }

    if (requiredRoles && !hasRole(decoded.role, requiredRoles)) {
      throw new AuthorizationError("Insufficient permissions")
    }

    return decoded
  }
}

// Extract token from request headers
export function extractTokenFromHeaders(headers: Headers): string | undefined {
  const authHeader = headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return undefined
}

// Generate secure random string for tokens
export function generateSecureRandom(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Token refresh utility
export async function refreshTokens(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
}> {
  const decoded = await verifyRefreshToken(refreshToken)
  if (!decoded) {
    throw new AuthenticationError("Invalid refresh token")
  }

  const newAccessToken = generateToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  })

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}