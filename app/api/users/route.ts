import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase, mockDb, addAuditLog } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'
import { extractUserFromRequest, enforceAuthz } from '@/lib/api-authz-middleware'
import { createAuditEntry, generateDiff } from '@/lib/audit-engine'

// Ensure database is seeded
seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    const tenantId = request.headers.get('x-tenant-id') || 'tenant-1'
    
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')

    let users = [...mockDb.users]

    // TENANT SCOPING: Filter by tenant
    users = users.filter((u: any) => u.tenantId === tenantId)

    // Apply filters
    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      users = users.filter((u) => u.status === status)
    }

    // Apply pagination
    const { items, total } = applyPagination(users, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
        tenantId,
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch users', correlationId),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const actor = extractUserFromRequest(request)
    const tenantId = request.headers.get('x-tenant-id') || 'tenant-1'

    if (!actor) {
      return NextResponse.json(
        createErrorResponse('UNAUTHORIZED', 'Missing authentication', correlationId),
        { status: 401 }
      )
    }

    const { userId, status, notes, reason } = await request.json()

    // AUTHZ: Check permission to update user
    const authz = enforceAuthz(actor, 'users', 'update')
    if (!authz.allowed) {
      return NextResponse.json(
        createErrorResponse(authz.error || 'FORBIDDEN', authz.explanation || 'Authorization denied', correlationId),
        { status: authz.statusCode }
      )
    }

    const user = mockDb.users.find((u: any) => u.id === userId)
    if (!user) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found', correlationId),
        { status: 404 }
      )
    }

    // TENANT SCOPING: Ensure user belongs to same tenant
    if ((user as any).tenantId !== tenantId) {
      return NextResponse.json(
        createErrorResponse('FORBIDDEN', 'User belongs to different tenant', correlationId),
        { status: 403 }
      )
    }

    const oldStatus = user.status
    const before = JSON.parse(JSON.stringify(user))

    if (status) {
      user.status = status
    }

    if (notes) {
      user.notes = notes
    }

    // Create audit entry
    const diff = generateDiff(before, user)
    const auditEntry = createAuditEntry({
      actorId: actor.id,
      actorEmail: actor.email,
      role: actor.role,
      tenantId: actor.tenantId,
      action: 'update_user_status',
      resourceType: 'User',
      resourceId: userId,
      reason: reason || `Changed status from ${oldStatus} to ${status}`,
      before,
      after: user,
      diff,
      correlationId,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      deviceId: request.headers.get('x-device-id') || 'unknown',
      sessionId: request.headers.get('x-session-id') || 'unknown',
    })

    if (!mockDb.auditRecords) mockDb.auditRecords = []
    mockDb.auditRecords.push(auditEntry)

    // Log the action
    addAuditLog({
      actorId: actor.email,
      action: 'update_user_status',
      entityType: 'User',
      entityId: userId,
      description: `Changed user status from ${oldStatus} to ${status}`,
      reason: reason || 'No reason provided',
    })

    return NextResponse.json(
      createSuccessResponse(user, { 
        requestId: correlationId,
        auditId: auditEntry.id,
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update user', correlationId),
      { status: 500 }
    )
  }
}
