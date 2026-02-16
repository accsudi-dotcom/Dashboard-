import { NextRequest, NextResponse } from 'next/server'
import { getMockData } from '@/lib/mock-data'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'
import { seedDatabase } from '@/lib/mock-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params
    const correlationId = getCorrelationId(request.headers)

    // Ensure mock DB seeded
    seedDatabase()

    const data = await getMockData(resource)
    if (!data) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', `No mock data for resource: ${resource}`, correlationId),
        { status: 404 }
      )
    }

    return NextResponse.json(createSuccessResponse(data, { requestId: correlationId }))
  } catch (err) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Dev mock route error', correlationId),
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params
    const correlationId = getCorrelationId(request.headers)

    // For development: accept a payload and echo back as created
    const body = await request.json().catch(() => ({}))

    const created = { id: `mock-${Date.now()}`, ...body }

    return NextResponse.json(createSuccessResponse(created, { requestId: correlationId }), { status: 201 })
  } catch (err) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to create mock resource', correlationId),
      { status: 500 }
    )
  }
}
