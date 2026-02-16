import { v4 as uuidv4 } from 'uuid'
import type { ApiResponse } from '@/types'

export interface CreateResponseOptions {
  requestId?: string
  pagination?: {
    total: number
    page: number
    limit: number
  }
  tenantId?: string
  auditId?: string
}

export function createSuccessResponse<T>(
  data: T,
  options?: CreateResponseOptions
): ApiResponse<T> {
  const requestId = options?.requestId || uuidv4()

  return {
    success: true,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      ...(options?.pagination && {
        pagination: {
          ...options.pagination,
          pages: Math.ceil(options.pagination.total / options.pagination.limit),
        },
      }),
    },
  }
}

export function createErrorResponse(
  code: string,
  message: string,
  requestId?: string
): ApiResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
    },
    meta: {
      requestId: requestId || uuidv4(),
      timestamp: new Date().toISOString(),
    },
  }
}

export function getCorrelationId(headers: Headers): string {
  return headers.get('x-correlation-id') || uuidv4()
}

export function getPaginationParams(request: Request) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20'))

  return { page, limit, offset: (page - 1) * limit }
}

export function applyPagination<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; total: number } {
  const total = items.length
  const offset = (page - 1) * limit
  return {
    items: items.slice(offset, offset + limit),
    total,
  }
}
