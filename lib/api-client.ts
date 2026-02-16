/**
 * Sharoobi Console - API Client
 * Typed API wrapper with error handling, request correlation, and type safety
 */

import { z } from 'zod'

/**
 * Generate a unique request ID for correlation and audit logging
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface ApiRequestOptions<T> {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  path: string
  schema: z.ZodSchema<T>
  body?: unknown
  correlationId?: string
  headers?: Record<string, string>
}

interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
  errors?: Array<{
    code: string
    message: string
    details?: unknown
  }>
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(`API Error: ${code}`)
    this.name = 'ApiError'
  }
}

/**
 * Typed API client with automatic error handling and request correlation
 */
export const apiClient = {
  async request<T>(options: ApiRequestOptions<T>): Promise<T> {
    const correlationId = options.correlationId || generateRequestId()
    const url = `${process.env.NEXT_PUBLIC_API_URL || '/api'}${options.path}`

    console.log(`[API] ${options.method} ${options.path} (${correlationId})`)

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
          'X-Request-Id': generateRequestId(),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include',
      })

      const json = await response.json()

      if (!response.ok) {
        throw new ApiError(
          response.status,
          json.error?.code || 'UNKNOWN_ERROR',
          json.error?.details
        )
      }

      // Validate response with schema
      const apiResponse: ApiResponse<T> = json
      const validated = options.schema.parse(apiResponse.data)

      console.log(`[API] ✓ ${options.method} ${options.path}`)
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`[API] ✗ Validation error on ${options.path}:`, error.errors)
        throw new ApiError(500, 'VALIDATION_ERROR', error.errors)
      }

      if (error instanceof ApiError) {
        console.error(`[API] ✗ ${error.code} (${error.statusCode}):`, error.details)
        throw error
      }

      console.error(`[API] ✗ Unexpected error on ${options.path}:`, error)
      throw new ApiError(500, 'NETWORK_ERROR', { originalError: String(error) })
    }
  },

  async get<T>(path: string, schema: z.ZodSchema<T>) {
    return this.request({ method: 'GET', path, schema })
  },

  async post<T>(path: string, schema: z.ZodSchema<T>, body: unknown) {
    return this.request({ method: 'POST', path, schema, body })
  },

  async patch<T>(path: string, schema: z.ZodSchema<T>, body: unknown) {
    return this.request({ method: 'PATCH', path, schema, body })
  },

  async delete<T>(path: string, schema: z.ZodSchema<T>) {
    return this.request({ method: 'DELETE', path, schema })
  },
}

export { ApiError }
