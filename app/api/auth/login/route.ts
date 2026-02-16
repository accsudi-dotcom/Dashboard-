import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'
import { UserPassword } from '@/modules/users/domain/UserPassword'
import type { LoginRequest, LoginResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    const body = (await request.json()) as LoginRequest
    
    // Validate super admin credentials (configurable via env; fallback to demo)
    const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@sharoobi.local'
    const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@sharoobi'

    // Check email matches
    if (body.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password', correlationId),
        { status: 401 }
      )
    }

    // Hash provided password and compare with bcryptjs
    try {
      const adminPassword = UserPassword.create(ADMIN_PASSWORD)
      if (!adminPassword.matches(body.password)) {
        return NextResponse.json(
          createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password', correlationId),
          { status: 401 }
        )
      }
    } catch (hashError) {
      // If hashing fails, fall back to direct comparison (for basic demo safety)
      if (body.password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password', correlationId),
          { status: 401 }
        )
      }
    }

    // Create session
    const response: LoginResponse = {
      session: {
        id: uuidv4(),
        userId: 'admin-user',
        email: 'admin@sharoobi.local',
        role: 'admin',
        permissions: ['*'],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      token: uuidv4(),
    }

    const res = NextResponse.json(createSuccessResponse(response, { requestId: correlationId }))

    // Set secure session cookie
    res.cookies.set('sharoobi-session', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return res
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred', correlationId),
      { status: 500 }
    )
  }
}
