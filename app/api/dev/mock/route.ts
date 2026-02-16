import { NextRequest, NextResponse } from 'next/server'
import { getMockData } from '@/lib/mock-data'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'metrics'

    const data = await getMockData(type)

    if (!data) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', `No mock data for type: ${type}`, correlationId),
        { status: 404 }
      )
    }

    return NextResponse.json(createSuccessResponse(data, { requestId: correlationId }))
  } catch (err) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Could not fetch mock data', correlationId),
      { status: 500 }
    )
  }
}
