import { NextRequest } from 'next/server'
import { evaluateAuthz, explainDecision, requiresReason } from '@/lib/authz-engine'
import type { AdminUser } from '@/types/domain'
import type { Resource, Action, ABACContext } from '@/lib/authz-engine'

/**
 * Enforce authorization with optional reason requirement
 * Returns { allowed: boolean, statusCode: number, error?: string }
 */
export function enforceAuthz(
  user: AdminUser | null,
  resource: Resource,
  action: Action,
  context?: ABACContext
): { allowed: boolean; statusCode: number; error?: string; explanation?: string } {
  if (!user) {
    return {
      allowed: false,
      statusCode: 401,
      error: 'UNAUTHORIZED',
    }
  }

  const decision = evaluateAuthz(user, resource, action, context)

  if (!decision.allowed) {
    return {
      allowed: false,
      statusCode: 403,
      error: 'FORBIDDEN',
      explanation: explainDecision(decision),
    }
  }

  return {
    allowed: true,
    statusCode: 200,
  }
}

/**
 * Check if action requires reason (sensitive operations)
 */
export function checkReasonRequired(resource: Resource, action: Action): boolean {
  return requiresReason(resource, action)
}

/**
 * Validate reason is provided if required
 */
export async function validateReason(request: NextRequest, resource: Resource, action: Action) {
  if (!checkReasonRequired(resource, action)) {
    return { valid: true }
  }

  try {
    const body = await request.json()
    if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length === 0) {
      return {
        valid: false,
        error: 'REASON_REQUIRED',
        message: 'Reason is required for this sensitive action',
      }
    }
    return { valid: true, reason: body.reason }
  } catch {
    return {
      valid: false,
      error: 'INVALID_BODY',
      message: 'Invalid request body',
    }
  }
}

/**
 * Extract user from request (mock implementation)
 * In production: verify JWT, extract claims, validate signature
 */
export function extractUserFromRequest(request: NextRequest): AdminUser | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null

  const tenantId = request.headers.get('x-tenant-id') || 'tenant-1'

  // Mock: return user based on token
  if (token === 'admin-token') {
    return {
      id: 'admin-1',
      email: 'admin@sharoobi.local',
      name: 'Admin User',
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'super_admin',
      tenantId,
      permissions: [
        { resource: 'users', actions: ['read', 'create', 'update', 'delete', 'block', 'unblock'], conditions: {} },
        { resource: 'orders', actions: ['read', 'create', 'update', 'refund'], conditions: {} },
        { resource: 'payments', actions: ['read', 'create', 'refund'], conditions: {} },
        { resource: 'devices', actions: ['read', 'block', 'unblock'], conditions: {} },
        { resource: 'sessions', actions: ['read', 'revoke'], conditions: {} },
        { resource: 'flags', actions: ['read', 'create', 'publish', 'rollback'], conditions: {} },
      ],
    }
  }

  if (token === 'finance-token') {
    return {
      id: 'finance-1',
      email: 'finance@sharoobi.local',
      name: 'Finance Manager',
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'finance_manager',
      tenantId,
      permissions: [
        { resource: 'payments', actions: ['read', 'refund'], conditions: { maxAmount: 500 } },
        { resource: 'orders', actions: ['read'], conditions: {} },
      ],
    }
  }

  // Default: limited user
  return {
    id: 'user-1',
    email: 'user@sharoobi.local',
    name: 'User',
    mfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
    tenantId,
    permissions: [{ resource: 'users', actions: ['read'], conditions: {} }],
  }
}
