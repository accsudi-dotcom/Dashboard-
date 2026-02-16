import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    let sessions = [...mockDb.sessions]

    if (userId) {
      sessions = sessions.filter((s) => s.userId === userId)
    }

    const { items, total } = applyPagination(sessions, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch sessions', correlationId),
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { sessionId } = await request.json()

    const index = mockDb.sessions.findIndex((s) => s.id === sessionId)
    if (index === -1) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Session not found', correlationId),
        { status: 404 }
      )
    }

    mockDb.sessions.splice(index, 1)

    return NextResponse.json(
      createSuccessResponse({ success: true }, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to revoke session', correlationId),
      { status: 500 }
    )
  }
}
