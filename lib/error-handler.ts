import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

export interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

export class CustomError extends Error implements AppError {
  statusCode: number
  code: string
  details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.name = "CustomError"
    this.statusCode = statusCode
    this.code = code || "INTERNAL_ERROR"
    this.details = details
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR")
    this.name = "NotFoundError"
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR")
    this.name = "ConflictError"
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 500, "DATABASE_ERROR", details)
    this.name = "DatabaseError"
  }
}

export class ExternalServiceError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 502, "EXTERNAL_SERVICE_ERROR", details)
    this.name = "ExternalServiceError"
  }
}

// Error logging service
export class ErrorLogger {
  static async logError(error: Error, context?: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      context,
      ...(error instanceof CustomError && {
        statusCode: error.statusCode,
        code: error.code,
        details: error.details,
      }),
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorData)
    }

    // In production, send to external logging service
    if (process.env.NODE_ENV === "production") {
      try {
        // Replace with your logging service (e.g., Sentry, LogRocket, etc.)
        // await sendToLoggingService(errorData)
        console.error("Production error:", errorData)
      } catch (loggingError) {
        console.error("Failed to log error:", loggingError)
      }
    }
  }
}

// Global error handler for API routes
export function withErrorHandler(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      return handleApiError(error, req)
    }
  }
}

// API error handler
export async function handleApiError(error: unknown, req: NextRequest): Promise<NextResponse> {
  let statusCode = 500
  let message = "Internal server error"
  let code = "INTERNAL_ERROR"
  let details: any = undefined

  // Log the error
  await ErrorLogger.logError(error as Error, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  })

  if (error instanceof CustomError) {
    statusCode = error.statusCode
    message = error.message
    code = error.code
    details = error.details
  } else if (error instanceof ZodError) {
    statusCode = 400
    message = "Validation error"
    code = "VALIDATION_ERROR"
    details = error.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }))
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400
    code = "DATABASE_ERROR"
    
    switch (error.code) {
      case "P2002":
        message = "A record with this information already exists"
        details = { constraint: error.meta?.target }
        break
      case "P2025":
        message = "Record not found"
        statusCode = 404
        break
      case "P2003":
        message = "Foreign key constraint failed"
        break
      default:
        message = "Database operation failed"
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500
    message = "Database connection error"
    code = "DATABASE_CONNECTION_ERROR"
  } else if (error instanceof Error) {
    message = error.message
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal server error"
    details = undefined
  }

  return NextResponse.json({
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
      ...(process.env.NODE_ENV === "development" && {
        stack: (error as Error)?.stack,
      }),
    },
  }, { status: statusCode })
}

// Database error handler with retry logic
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on certain errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof ValidationError ||
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw new DatabaseError(`Operation failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`)
}

// Client-side error handler
export function handleClientError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === "string") {
    return error
  }
  
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message)
  }
  
  return "An unexpected error occurred"
}