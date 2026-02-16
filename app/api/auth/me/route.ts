import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const token = request.cookies.get('sharoobi-session')?.value

    if (!token) {
      return NextResponse.json(
        createErrorResponse('UNAUTHORIZED', 'No session found', correlationId),
        { status: 401 }
      )
    }

    // Return mock session for authenticated request
    const session = {
      id: 'session-1',
      userId: 'admin-user',
      email: 'admin@sharoobi.local',
      role: 'admin',
      permissions: ['*'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(createSuccessResponse(session, { requestId: correlationId }))
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred', correlationId),
      { status: 500 }
    )
  }
}
