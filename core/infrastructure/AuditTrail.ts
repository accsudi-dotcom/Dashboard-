/**
 * Audit Trail - Immutable log of all system actions
 * Captures who did what, when, why, and what changed
 * Critical for compliance, debugging, and security analysis
 */
export interface AuditEntry {
  id: string
  timestamp: Date
  correlationId?: string
  actor: {
    userId: string
    email: string
    role: string
    ipAddress: string
    deviceId: string
    sessionId: string
  }
  action: string
  resourceType: string
  resourceId: string
  changes: {
    before: Record<string, any>
    after: Record<string, any>
    diff: Record<string, any>
  }
  reason?: string
  status: 'success' | 'failure'
  error?: string
  metadata?: Record<string, any>
  tenantId?: string
}
export class AuditTrail {
  private entries: AuditEntry[] = []
  private index: Map<string, AuditEntry[]> = new Map()

  record(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const auditEntry: AuditEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    }

    this.entries.push(auditEntry)

    // Build indices for fast lookup
    const tenantKey = entry.tenantId || 'global'
    if (!this.index.has(tenantKey)) {
      this.index.set(tenantKey, [])
    }
    this.index.get(tenantKey)!.push(auditEntry)

    return auditEntry
  }

  findByTenant(tenantId: string): AuditEntry[] {
    return this.index.get(tenantId) || []
  }

  findByResource(resourceType: string, resourceId: string): AuditEntry[] {
    return this.entries.filter((e) => e.resourceType === resourceType && e.resourceId === resourceId)
  }

  findByActor(userId: string): AuditEntry[] {
    return this.entries.filter((e) => e.actor.userId === userId)
  }

  findByAction(action: string): AuditEntry[] {
    return this.entries.filter((e) => e.action === action)
  }

  findByDateRange(startDate: Date, endDate: Date): AuditEntry[] {
    return this.entries.filter((e) => e.timestamp >= startDate && e.timestamp <= endDate)
  }

  search(criteria: {
    tenantId?: string
    resourceType?: string
    action?: string
    userId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): AuditEntry[] {
    let results = this.entries

    if (criteria.tenantId) {
      results = results.filter((e) => e.tenantId === criteria.tenantId)
    }

    if (criteria.resourceType) {
      results = results.filter((e) => e.resourceType === criteria.resourceType)
    }

    if (criteria.action) {
      results = results.filter((e) => e.action === criteria.action)
    }

    if (criteria.userId) {
      results = results.filter((e) => e.actor.userId === criteria.userId)
    }

    if (criteria.startDate) {
      results = results.filter((e) => e.timestamp >= criteria.startDate!)
    }

    if (criteria.endDate) {
      results = results.filter((e) => e.timestamp <= criteria.endDate!)
    }

    const offset = criteria.offset || 0
    const limit = criteria.limit || 100

    return results.slice(offset, offset + limit)
  }

  getAll(): AuditEntry[] {
    return [...this.entries]
  }

  count(): number {
    return this.entries.length
  }

  clear(): void {
    this.entries = []
    this.index.clear()
  }

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

export const auditTrail = new AuditTrail()
