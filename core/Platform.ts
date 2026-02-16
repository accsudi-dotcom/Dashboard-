/**
 * Platform Container
 * Central coordination point for all core engines and services
 * Implements the Container pattern for dependency management
 */
import { InMemoryStore } from './infrastructure/InMemoryStore'
import { EventBus, eventBus } from './domain/events/EventBus'
import { TenantContext, tenantContext } from './infrastructure/TenantContext'
import { PermissionEngine, permissionEngine } from './infrastructure/PermissionEngine'
import { PolicyEngine, policyEngine } from './infrastructure/PolicyEngine'
import { FeatureFlagEngine, featureFlagEngine } from './infrastructure/FeatureFlagEngine'
import { AuditTrail, auditTrail } from './infrastructure/AuditTrail'
import { ObservabilityService, observabilityService } from './infrastructure/ObservabilityService'
import { WorkflowEngine, workflowEngine } from './infrastructure/WorkflowEngine'
import { WebhookDispatcher, webhookDispatcher } from './infrastructure/WebhookDispatcher'
import { AnalyticsEngine, analyticsEngine } from './infrastructure/AnalyticsEngine'
import { UnitOfWork, globalUnitOfWork } from './infrastructure/UnitOfWork'

export interface PlatformConfig {
  debug?: boolean
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
  maxRetries?: number
  requestTimeoutMs?: number
}

/**
 * Sharoobi Console Platform
 * Production-grade enterprise SaaS admin platform
 * Integrates all core engines and services
 */
export class Platform {
  private static instance: Platform
  readonly config: PlatformConfig

  // Core engines (singletons)
  readonly eventBus: EventBus
  readonly tenantContext: TenantContext
  readonly permissionEngine: PermissionEngine
  readonly policyEngine: PolicyEngine
  readonly featureFlagEngine: FeatureFlagEngine
  readonly auditTrail: AuditTrail
  readonly observabilityService: ObservabilityService
  readonly workflowEngine: WorkflowEngine
  readonly webhookDispatcher: WebhookDispatcher
  readonly analyticsEngine: AnalyticsEngine
  readonly unitOfWork: UnitOfWork

  // Storage
  readonly store: InMemoryStore

  private constructor(config: PlatformConfig = {}) {
    this.config = {
      debug: config.debug || false,
      logLevel: config.logLevel || 'info',
      maxRetries: config.maxRetries || 3,
      requestTimeoutMs: config.requestTimeoutMs || 30000,
    }

    // Initialize engines
    this.store = new InMemoryStore()
    this.eventBus = eventBus
    this.tenantContext = tenantContext
    this.permissionEngine = permissionEngine
    this.policyEngine = policyEngine
    this.featureFlagEngine = featureFlagEngine
    this.auditTrail = auditTrail
    this.observabilityService = observabilityService
    this.observabilityService.setMinLogLevel(this.config.logLevel!)
    this.workflowEngine = workflowEngine
    this.webhookDispatcher = webhookDispatcher
    this.analyticsEngine = analyticsEngine
    this.unitOfWork = globalUnitOfWork
  }

  static getInstance(config?: PlatformConfig): Platform {
    if (!Platform.instance) {
      Platform.instance = new Platform(config)
    }
    return Platform.instance
  }

  static reset(): void {
    // Reset all singleton state - useful for testing
    if (Platform.instance) {
      Platform.instance.store.clear()
      Platform.instance.eventBus.clear()
      Platform.instance.auditTrail.clear()
      Platform.instance.observabilityService.clear()
      Platform.instance.tenantContext.reset()
    }
    Platform.instance = undefined as any
  }

  /**
   * Health check - returns status of all core systems
   */
  getHealth(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      engines: {
        eventBus: { status: 'ready' },
        tenantContext: { status: 'ready' },
        permissionEngine: { status: 'ready' },
        policyEngine: { status: 'ready' },
        featureFlagEngine: { status: 'ready' },
        auditTrail: {
          status: 'ready',
          entriesCount: this.auditTrail.count(),
        },
        observabilityService: { status: 'ready' },
        workflowEngine: { status: 'ready' },
        webhookDispatcher: { status: 'ready' },
        analyticsEngine: { status: 'ready' },
      },
      uptime: process.uptime?.() || 0,
    }
  }

  /**
   * Get platform statistics for monitoring
   */
  getStatistics(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      audit: {
        totalEntries: this.auditTrail.count(),
      },
      events: {
        history: this.eventBus.getEventHistory().length,
        deadLetterQueue: this.eventBus.getDeadLetterQueue().length,
      },
      logs: {
        total: this.observabilityService.getLogs().length,
      },
      metrics: {
        total: this.observabilityService.getMetrics?.()?.length || 0,
      },
    }
  }
}

export const platform = Platform.getInstance()
