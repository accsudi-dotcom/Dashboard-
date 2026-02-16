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
    const type = url.searchParams.get('type')

    let ledger = [...mockDb.walletLedger]

    if (userId) {
      ledger = ledger.filter((l) => l.userId === userId)
    }

    if (type) {
      ledger = ledger.filter((l) => l.type === type)
    }

    // Sort by date descending
    ledger = ledger.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const { items, total } = applyPagination(ledger, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch wallet ledger', correlationId),
      { status: 500 }
    )
  }
}
