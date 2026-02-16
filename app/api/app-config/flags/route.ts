import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb, addAuditLog } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    
    return NextResponse.json(
      createSuccessResponse(mockDb.featureFlags, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch feature flags', correlationId),
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { action, flagId, enabled, rolloutPercentage, reason } = await request.json()

    const flag = mockDb.featureFlags.find((f) => f.id === flagId)
    if (!flag) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Feature flag not found', correlationId),
        { status: 404 }
      )
    }

    if (action === 'publish') {
      if (!reason) {
        return NextResponse.json(
          createErrorResponse('VALIDATION_ERROR', 'Reason required for publish', correlationId),
          { status: 400 }
        )
      }

      flag.status = 'published'
      flag.version = flag.draftVersion || flag.version
      flag.draftVersion = undefined
      flag.publishedAt = new Date().toISOString()
      flag.publishedBy = 'admin@sharoobi.local'

      addAuditLog({
        actorId: 'admin@sharoobi.local',
        action: 'publish_feature_flag',
        entityType: 'FeatureFlag',
        entityId: flagId,
        description: `Published feature flag: ${flag.name}`,
        reason,
      })
    } else if (action === 'draft') {
      flag.status = 'draft'
      flag.draftVersion = (flag.draftVersion || flag.version) + 1
    } else if (action === 'update_draft') {
      if (!flag.draftVersion) {
        flag.draftVersion = flag.version + 1
      }
      
      if (enabled !== undefined) flag.enabled = enabled
      if (rolloutPercentage !== undefined) flag.rolloutPercentage = rolloutPercentage
    } else if (action === 'rollback') {
      flag.status = 'published'
      flag.draftVersion = undefined
      flag.publishedAt = new Date().toISOString()

      addAuditLog({
        actorId: 'admin@sharoobi.local',
        action: 'rollback_feature_flag',
        entityType: 'FeatureFlag',
        entityId: flagId,
        description: `Rolled back feature flag: ${flag.name}`,
        reason,
      })
    }

    return NextResponse.json(
      createSuccessResponse(flag, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update feature flag', correlationId),
      { status: 500 }
    )
  }
}
