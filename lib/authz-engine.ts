import type { AdminUser } from '@/types/domain'

export type Resource = 'users' | 'orders' | 'payments' | 'devices' | 'sessions' | 'flags' | 'providers' | 'tickets'
export type Action = 'read' | 'create' | 'update' | 'delete' | 'refund' | 'block' | 'unblock' | 'revoke' | 'publish' | 'rollback'

export interface ABACContext {
  tenantId?: string
  region?: string
  providerId?: string
  amountThreshold?: number
  ownership?: string
  [key: string]: any
}

export interface AuthzDecision {
  allowed: boolean
  matchedRules?: string[]
  deniedReason?: string
  missingPermissions?: string[]
  failedConditions?: string[]
}

/**
 * Evaluate authorization with RBAC + ABAC
 */
export function evaluateAuthz(user: AdminUser | null, resource: Resource, action: Action, context?: ABACContext): AuthzDecision {
  if (!user) {
    return {
      allowed: false,
      deniedReason: 'No user context',
    }
  }

  // Super admin always allowed
  if (user.role === 'super_admin') {
    return {
      allowed: true,
      matchedRules: ['super_admin_bypass'],
    }
  }

  // Find matching permission
  const permission = user.permissions.find((p) => p.resource === resource)

  if (!permission) {
    return {
      allowed: false,
      deniedReason: `No permission for resource: ${resource}`,
      missingPermissions: [`${resource}:${action}`],
    }
  }

  if (!permission.actions.includes(action)) {
    return {
      allowed: false,
      deniedReason: `Action not allowed: ${action}`,
      missingPermissions: [`${resource}:${action}`],
    }
  }

  // Check ABAC conditions
  if (permission.conditions && Object.keys(permission.conditions).length > 0 && context) {
    const failedConditions: string[] = []

    Object.entries(permission.conditions).forEach(([key, value]) => {
      if (key === 'maxAmount' && typeof value === 'number' && typeof context.amountThreshold === 'number') {
        if (context.amountThreshold > value) {
          failedConditions.push(`Amount ${context.amountThreshold} exceeds max ${value}`)
        }
      } else if (context[key] !== value) {
        failedConditions.push(`${key}: expected ${value}, got ${context[key]}`)
      }
    })

    if (failedConditions.length > 0) {
      return {
        allowed: false,
        deniedReason: 'ABAC conditions not met',
        failedConditions,
      }
    }
  }

  return {
    allowed: true,
    matchedRules: [`${user.role}_${resource}_${action}`],
  }
}

/**
 * Generate explanation for authorization decision
 */
export function explainDecision(decision: AuthzDecision): string {
  if (decision.allowed) {
    return `Authorized. Matched rules: ${decision.matchedRules?.join(', ') || 'default'}`
  }

  const parts: string[] = [decision.deniedReason || 'Authorization denied']

  if (decision.missingPermissions && decision.missingPermissions.length > 0) {
    parts.push(`Missing: ${decision.missingPermissions.join(', ')}`)
  }

  if (decision.failedConditions && decision.failedConditions.length > 0) {
    parts.push(`Conditions: ${decision.failedConditions.join(', ')}`)
  }

  return parts.join(' | ')
}

/**
 * Check if action requires reason (sensitive operations)
 */
export function requiresReason(resource: Resource, action: Action): boolean {
  const sensitiveActions = [
    'refund', // refund_payment
    'block', // block_user, block_device
    'unblock', // unblock_user, unblock_device
    'revoke', // revoke_session
    'publish', // publish_flag, publish_config
    'rollback', // rollback_flag, rollback_config
    'delete', // delete operations
  ]

  return sensitiveActions.includes(action)
}
