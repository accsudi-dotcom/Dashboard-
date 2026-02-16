import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb, addAuditLog } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const verificationStatus = url.searchParams.get('verificationStatus')

    let providers = [...mockDb.providers]

    if (status) {
      providers = providers.filter((p) => p.status === status)
    }

    if (verificationStatus) {
      providers = providers.filter((p) => p.verificationStatus === verificationStatus)
    }

    const { items, total } = applyPagination(providers, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch providers', correlationId),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { providerId, verificationStatus, status, reason } = await request.json()

    const provider = mockDb.providers.find((p) => p.id === providerId)
    if (!provider) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Provider not found', correlationId),
        { status: 404 }
      )
    }

    if (verificationStatus) {
      const oldStatus = provider.verificationStatus
      provider.verificationStatus = verificationStatus

      addAuditLog({
        actorId: 'admin@sharoobi.local',
        action: 'update_provider_verification',
        entityType: 'Provider',
        entityId: providerId,
        description: `Changed verification status from ${oldStatus} to ${verificationStatus}`,
        reason,
      })
    }

    if (status) {
      const oldStatus = provider.status
      provider.status = status

      addAuditLog({
        actorId: 'admin@sharoobi.local',
        action: 'update_provider_status',
        entityType: 'Provider',
        entityId: providerId,
        description: `Changed provider status from ${oldStatus} to ${status}`,
        reason,
      })
    }

    return NextResponse.json(
      createSuccessResponse(provider, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update provider', correlationId),
      { status: 500 }
    )
  }
}
