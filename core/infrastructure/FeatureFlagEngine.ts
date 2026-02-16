/**
 * Feature Flag Engine
 * Supports percentage rollout, user targeting, tenant targeting, and role-based flags
 */
export interface FeatureFlagTargeting {
  userIds?: string[]
  tenantIds?: string[]
  roles?: string[]
  regions?: string[]
  locales?: string[]
  customRules?: (context: any) => boolean
}

export interface FeatureFlag {
  id: string
  name: string
  enabled: boolean
  rolloutPercentage: number // 0-100
  targeting?: FeatureFlagTargeting
  description?: string
  variants?: Record<string, any>
}

export interface FlagEvaluationContext {
  userId?: string
  tenantId?: string
  role?: string
  region?: string
  locale?: string
  [key: string]: any
}

export interface FlagEvaluationResult {
  enabled: boolean
  variant?: string
  reason: string
}

export class FeatureFlagEngine {
  private flags: Map<string, FeatureFlag> = new Map()

  createFlag(flag: FeatureFlag): void {
    this.flags.set(flag.id, flag)
  }

  updateFlag(flagId: string, updates: Partial<FeatureFlag>): void {
    const flag = this.flags.get(flagId)
    if (flag) {
      this.flags.set(flagId, { ...flag, ...updates })
    }
  }

  evaluate(flagId: string, context: FlagEvaluationContext): FlagEvaluationResult {
    const flag = this.flags.get(flagId)

    if (!flag) {
      return { enabled: false, reason: 'Flag not found' }
    }

    if (!flag.enabled) {
      return { enabled: false, reason: 'Flag is disabled globally' }
    }

    // Check targeting rules
    if (flag.targeting) {
      if (!this.matchesTargeting(flag.targeting, context)) {
        return { enabled: false, reason: 'Does not match targeting rules' }
      }
    }

    // Check rollout percentage
    if (!this.shouldRollout(flagId, context, flag.rolloutPercentage)) {
      return { enabled: false, reason: `Below rollout percentage (${flag.rolloutPercentage}%)` }
    }

    // Select variant if available
    let variant: string | undefined
    if (flag.variants) {
      variant = this.selectVariant(flagId, Object.keys(flag.variants))
    }

    return { enabled: true, variant, reason: 'Flag matched all conditions' }
  }

  private matchesTargeting(targeting: FeatureFlagTargeting, context: FlagEvaluationContext): boolean {
    if (targeting.userIds && context.userId && !targeting.userIds.includes(context.userId)) {
      return false
    }

    if (targeting.tenantIds && context.tenantId && !targeting.tenantIds.includes(context.tenantId)) {
      return false
    }

    if (targeting.roles && context.role && !targeting.roles.includes(context.role)) {
      return false
    }

    if (targeting.regions && context.region && !targeting.regions.includes(context.region)) {
      return false
    }

    if (targeting.locales && context.locale && !targeting.locales.includes(context.locale)) {
      return false
    }

    if (targeting.customRules && !targeting.customRules(context)) {
      return false
    }

    return true
  }

  private shouldRollout(flagId: string, context: FlagEvaluationContext, percentage: number): boolean {
    if (percentage === 100) return true
    if (percentage === 0) return false

    // Deterministic hash based on flag + user for consistent rollout
    const key = `${flagId}:${context.userId || context.tenantId || 'anonymous'}`
    const hash = this.hashCode(key)
    return Math.abs(hash) % 100 < percentage
  }

  private selectVariant(flagId: string, variants: string[]): string {
    if (variants.length === 0) return ''
    const key = `${flagId}:variant`
    const hash = Math.abs(this.hashCode(key))
    return variants[hash % variants.length]
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
    }
    return hash
  }

  getFlag(flagId: string): FeatureFlag | undefined {
    return this.flags.get(flagId)
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values())
  }

  deleteFlag(flagId: string): void {
    this.flags.delete(flagId)
  }
}

export const featureFlagEngine = new FeatureFlagEngine()
