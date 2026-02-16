import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb, addSecurityEvent } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const severity = url.searchParams.get('severity')
    const stream = url.searchParams.get('stream') === 'true'

    let events = [...mockDb.securityEvents]

    // Apply filters
    if (type) {
      events = events.filter((e) => e.type === type)
    }

    if (severity) {
      events = events.filter((e) => e.severity === severity)
    }

    // Sort by date descending
    events = events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // For stream mode, return all recent events and simulate real-time
    if (stream) {
      // In a real app, this would use Server-Sent Events
      // For now, return all events
      return NextResponse.json(
        createSuccessResponse(events.slice(0, 50), {
          requestId: correlationId,
        })
      )
    }

    const { items, total } = applyPagination(events, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch security events', correlationId),
      { status: 500 }
    )
  }
}
