/**
 * Policy Engine - RBAC + ABAC Hybrid
 * Evaluates access control policies based on roles AND attributes
 * ABAC (Attribute-Based Access Control) adds context like tenant, region, amount, etc.
 */
export interface ABACAttributes {
  tenantId?: string
  userId?: string
  region?: string
  locale?: string
  amountThreshold?: number
  ownership?: boolean
  [key: string]: any
}

export interface PolicyRule {
  id: string
  name: string
  resource: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: Record<string, any>
  priority: number
}

export interface PolicyDecision {
  allowed: boolean
  reason: string
  matchedRules: PolicyRule[]
}

export class PolicyEngine {
  private rules: Map<string, PolicyRule[]> = new Map()

  addRule(rule: PolicyRule): void {
    const key = `${rule.resource}:${rule.action}`
    if (!this.rules.has(key)) {
      this.rules.set(key, [])
    }
    this.rules.get(key)!.push(rule)
    // Sort by priority (higher first)
    this.rules.get(key)!.sort((a, b) => b.priority - a.priority)
  }

  evaluate(
    resource: string,
    action: string,
    attributes: ABACAttributes,
    userRole: string
  ): PolicyDecision {
    const key = `${resource}:${action}`
    const applicableRules = this.rules.get(key) || []
    const matchedRules: PolicyRule[] = []
    let allowed = false
    let reason = 'No matching policies'

    for (const rule of applicableRules) {
      if (this.checkConditions(rule.conditions, attributes)) {
        matchedRules.push(rule)

        if (rule.effect === 'deny') {
          allowed = false
          reason = `Denied by policy: ${rule.name}`
          break
        } else if (rule.effect === 'allow') {
          allowed = true
          reason = `Allowed by policy: ${rule.name}`
        }
      }
    }

    return {
      allowed,
      reason,
      matchedRules,
    }
  }

  private checkConditions(conditions: Record<string, any> | undefined, attributes: ABACAttributes): boolean {
    if (!conditions) return true

    return Object.entries(conditions).every(([key, expectedValue]) => {
      const actualValue = attributes[key]

      if (typeof expectedValue === 'object' && expectedValue !== null) {
        // Support operators like { gt: 100, lt: 1000 }
        if ('gt' in expectedValue && actualValue !== undefined) {
          return actualValue > expectedValue.gt
        }
        if ('gte' in expectedValue && actualValue !== undefined) {
          return actualValue >= expectedValue.gte
        }
        if ('lt' in expectedValue && actualValue !== undefined) {
          return actualValue < expectedValue.lt
        }
        if ('lte' in expectedValue && actualValue !== undefined) {
          return actualValue <= expectedValue.lte
        }
        if ('in' in expectedValue && Array.isArray(expectedValue.in)) {
          return expectedValue.in.includes(actualValue)
        }
      }

      return actualValue === expectedValue
    })
  }

  getRules(resource: string, action: string): PolicyRule[] {
    return this.rules.get(`${resource}:${action}`) || []
  }

  removeRule(ruleId: string): void {
    for (const rules of this.rules.values()) {
      const index = rules.findIndex((r) => r.id === ruleId)
      if (index !== -1) {
        rules.splice(index, 1)
      }
    }
  }
}

export const policyEngine = new PolicyEngine()
