import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    
    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    const entityType = url.searchParams.get('entityType')
    const entityId = url.searchParams.get('entityId')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    let logs = [...mockDb.auditLogs]

    // Apply filters
    if (action) {
      logs = logs.filter((l) => l.action === action)
    }

    if (entityType) {
      logs = logs.filter((l) => l.entityType === entityType)
    }

    if (entityId) {
      logs = logs.filter((l) => l.entityId === entityId)
    }

    if (startDate) {
      const start = new Date(startDate)
      logs = logs.filter((l) => new Date(l.createdAt) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      logs = logs.filter((l) => new Date(l.createdAt) <= end)
    }

    // Sort by date descending
    logs = logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const { items, total } = applyPagination(logs, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch audit logs', correlationId),
      { status: 500 }
    )
  }
}
