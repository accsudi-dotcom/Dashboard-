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
    const priority = url.searchParams.get('priority')

    let tickets = [...mockDb.tickets]

    if (status) {
      tickets = tickets.filter((t) => t.status === status)
    }

    if (priority) {
      tickets = tickets.filter((t) => t.priority === priority)
    }

    const { items, total } = applyPagination(tickets, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch tickets', correlationId),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { ticketId, status, assignedToId, reason } = await request.json()

    const ticket = mockDb.tickets.find((t) => t.id === ticketId)
    if (!ticket) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Ticket not found', correlationId),
        { status: 404 }
      )
    }

    const changes: any = {}

    if (status) {
      changes.oldStatus = ticket.status
      ticket.status = status
      changes.newStatus = status
    }

    if (assignedToId !== undefined) {
      changes.oldAssignedTo = ticket.assignedToId
      ticket.assignedToId = assignedToId
      changes.newAssignedTo = assignedToId
    }

    ticket.updatedAt = new Date().toISOString()

    addAuditLog({
      actorId: 'admin@sharoobi.local',
      action: 'update_ticket',
      entityType: 'Ticket',
      entityId: ticketId,
      description: `Updated ticket`,
      changes: { before: changes.oldStatus, after: changes.newStatus },
      reason,
    })

    return NextResponse.json(
      createSuccessResponse(ticket, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update ticket', correlationId),
      { status: 500 }
    )
  }
}
