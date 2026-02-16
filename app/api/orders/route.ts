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
    const userId = url.searchParams.get('userId')

    let orders = [...mockDb.orders]

    if (status) {
      orders = orders.filter((o) => o.status === status)
    }

    if (userId) {
      orders = orders.filter((o) => o.userId === userId)
    }

    const { items, total } = applyPagination(orders, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch orders', correlationId),
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { action, entityIds, reason } = await request.json()

    if (action === 'bulk_cancel') {
      for (const orderId of entityIds) {
        const order = mockDb.orders.find((o) => o.id === orderId)
        if (order && order.status !== 'delivered') {
          const oldStatus = order.status
          order.status = 'cancelled'
          
          addAuditLog({
            actorId: 'admin@sharoobi.local',
            action: 'cancel_order',
            entityType: 'Order',
            entityId: orderId,
            description: `Cancelled order (was ${oldStatus})`,
            reason,
          })
        }
      }
    }

    return NextResponse.json(
      createSuccessResponse({
        affectedCount: entityIds.length,
      }, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Bulk action failed', correlationId),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { orderId, status, reason } = await request.json()

    const order = mockDb.orders.find((o) => o.id === orderId)
    if (!order) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Order not found', correlationId),
        { status: 404 }
      )
    }

    const oldStatus = order.status
    order.status = status
    order.updatedAt = new Date().toISOString()

    addAuditLog({
      actorId: 'admin@sharoobi.local',
      action: 'update_order_status',
      entityType: 'Order',
      entityId: orderId,
      description: `Changed order status from ${oldStatus} to ${status}`,
      reason,
    })

    return NextResponse.json(
      createSuccessResponse(order, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update order', correlationId),
      { status: 500 }
    )
  }
}
