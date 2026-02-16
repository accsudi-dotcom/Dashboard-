import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { seedDatabase, mockDb, addAuditLog } from '@/lib/mock-db'
import { createSuccessResponse, createErrorResponse, getPaginationParams, applyPagination, getCorrelationId } from '@/lib/api-response'
import { extractUserFromRequest, enforceAuthz, validateReason } from '@/lib/api-authz-middleware'
import { createAuditEntry, generateDiff } from '@/lib/audit-engine'

seedDatabase()

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { page, limit } = getPaginationParams(request)
    
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let payments = [...mockDb.payments]

    if (status) {
      payments = payments.filter((p) => p.status === status)
    }

    const { items, total } = applyPagination(payments, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch payments', correlationId),
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const user = extractUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        createErrorResponse('UNAUTHORIZED', 'Missing authorization', correlationId),
        { status: 401 }
      )
    }

    const { paymentId, action, reason } = await request.json()

    // Authorization enforcement for sensitive actions
    if (action === 'refund') {
      const authz = enforceAuthz(user, 'payments', 'refund')
      if (!authz.allowed) {
        return NextResponse.json(
          createErrorResponse(authz.error || 'FORBIDDEN', authz.explanation || 'Authorization denied', correlationId),
          { status: authz.statusCode }
        )
      }

      // Validate reason is provided
      const reasonValidation = await validateReason(request, 'payments', 'refund')
      if (!reasonValidation.valid) {
        return NextResponse.json(
          createErrorResponse(reasonValidation.error || 'BAD_REQUEST', reasonValidation.message || 'Invalid request', correlationId),
          { status: 400 }
        )
      }
    }

    const payment = mockDb.payments.find((p) => p.id === paymentId)
    if (!payment) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Payment not found', correlationId),
        { status: 404 }
      )
    }

    if (action === 'refund') {
      // Create before diff
      const before = JSON.parse(JSON.stringify(payment))

      payment.status = 'refunded'
      payment.refundedAt = new Date().toISOString()
      payment.refundReason = reason

      // Create after diff
      const diff = generateDiff(before, payment)

      // Create immutable audit entry
      const auditEntry = createAuditEntry({
        actorId: user.id,
        actorEmail: user.email,
        role: user.role,
        tenantId: user.tenantId,
        action: 'refund_payment',
        resourceType: 'Payment',
        resourceId: paymentId,
        reason: reason || 'No reason provided',
        before,
        after: payment,
        diff,
        correlationId,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        deviceId: request.headers.get('x-device-id') || 'unknown',
        sessionId: request.headers.get('x-session-id') || 'unknown',
      })

      // Persist audit record
      if (!mockDb.auditRecords) mockDb.auditRecords = []
      mockDb.auditRecords.push(auditEntry)

      // Also legacy audit log
      addAuditLog({
        actorId: user.email,
        action: 'refund_payment',
        entityType: 'Payment',
        entityId: paymentId,
        description: `Refunded payment of ${payment.amount} ${payment.currency}`,
        reason,
      })
    }

    return NextResponse.json(
      createSuccessResponse(payment, { 
        requestId: correlationId,
        auditId: mockDb.auditRecords?.[mockDb.auditRecords.length - 1]?.id,
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to process payment action', correlationId),
      { status: 500 }
    )
  }
}
