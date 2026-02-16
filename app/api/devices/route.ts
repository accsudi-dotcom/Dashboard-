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

    let devices = [...mockDb.devices]

    if (userId) {
      devices = devices.filter((d) => d.userId === userId)
    }

    const { items, total } = applyPagination(devices, page, limit)

    return NextResponse.json(
      createSuccessResponse(items, {
        requestId: correlationId,
        pagination: { total, page, limit },
      })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to fetch devices', correlationId),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const { deviceId, action } = await request.json()

    const device = mockDb.devices.find((d) => d.id === deviceId)
    if (!device) {
      return NextResponse.json(
        createErrorResponse('NOT_FOUND', 'Device not found', correlationId),
        { status: 404 }
      )
    }

    if (action === 'block') {
      device.blocked = true
    } else if (action === 'unblock') {
      device.blocked = false
    } else if (action === 'trust') {
      device.trustScore = Math.min(100, device.trustScore + 10)
    }

    return NextResponse.json(
      createSuccessResponse(device, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Failed to update device', correlationId),
      { status: 500 }
    )
  }
}
