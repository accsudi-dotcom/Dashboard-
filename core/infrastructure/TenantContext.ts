import type { DomainError } from '../domain/errors/DomainError'
import { UnauthorizedError } from '../domain/errors/DomainError'

/**
 * Tenant Context for multi-tenant isolation
 * Ensures all operations are scoped to the current tenant
 * Implements context-local storage pattern
 */
export interface TenantInfo {
  tenantId: string
  features: string[]
  region: string
  locale: string
  customMetadata?: Record<string, any>
}

export interface UserContext {
  userId: string
  email: string
  role: string
  tenantId: string
  deviceId: string
  sessionId: string
  ipAddress: string
  permissions: string[]
}

export class TenantContext {
  private static instance: TenantContext
  private tenantStack: TenantInfo[] = []
  private userStack: UserContext[] = []

  private constructor() {}

  static getInstance(): TenantContext {
    if (!TenantContext.instance) {
      TenantContext.instance = new TenantContext()
    }
    return TenantContext.instance
  }

  setTenant(tenant: TenantInfo): void {
    this.tenantStack.push(tenant)
  }

  getCurrentTenant(): TenantInfo | null {
    return this.tenantStack.length > 0 ? this.tenantStack[this.tenantStack.length - 1] : null
  }

  requireTenant(): TenantInfo {
    const tenant = this.getCurrentTenant()
    if (!tenant) {
      throw new UnauthorizedError('No tenant context set')
    }
    return tenant
  }

  removeTenant(): void {
    if (this.tenantStack.length > 0) {
      this.tenantStack.pop()
    }
  }

  setUser(user: UserContext): void {
    if (user.tenantId !== this.requireTenant().tenantId) {
      throw new UnauthorizedError('User tenant mismatch')
    }
    this.userStack.push(user)
  }

  getCurrentUser(): UserContext | null {
    return this.userStack.length > 0 ? this.userStack[this.userStack.length - 1] : null
  }

  requireUser(): UserContext {
    const user = this.getCurrentUser()
    if (!user) {
      throw new UnauthorizedError('No user context set')
    }
    return user
  }

  removeUser(): void {
    if (this.userStack.length > 0) {
      this.userStack.pop()
    }
  }

  async runWithContext<T>(tenant: TenantInfo, user: UserContext, fn: () => Promise<T>): Promise<T> {
    this.setTenant(tenant)
    this.setUser(user)
    try {
      return await fn()
    } finally {
      this.removeUser()
      this.removeTenant()
    }
  }

  reset(): void {
    this.tenantStack = []
    this.userStack = []
  }
}

export const tenantContext = TenantContext.getInstance()
