"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: "official" | "claimant"
}

export function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me")
        const result = await response.json()

        if (result.success) {
          setUser(result.user)

          // Check role requirement
          if (requireRole && result.user.role !== requireRole) {
            router.push("/unauthorized")
            return
          }
        } else {
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
        return
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, requireRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
