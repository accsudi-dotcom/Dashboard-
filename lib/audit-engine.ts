import { v4 as uuidv4 } from 'uuid'

export interface AuditRecord {
  id: string
  actorId: string
  actorEmail: string
  role: string
  tenantId: string
  action: string
  resourceType: string
  resourceId: string
  reason?: string
  before?: any
  after?: any
  diff?: any
  correlationId: string
  ip: string
  userAgent: string
  deviceId: string
  sessionId: string
  timestamp: string
}

export interface DiffRecord {
  added?: Record<string, any>
  removed?: Record<string, any>
  modified?: Record<string, { before: any; after: any }>
}

/**
 * Create an immutable audit record
 */
export function createAuditEntry(data: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...data,
  }
}

/**
 * Alternative export name for compatibility
 */
export const createAuditRecord = createAuditEntry

/**
 * Generate a diff between two objects
 */
export function generateDiff(before: any, after: any): DiffRecord {
  const diff: DiffRecord = {}

  const beforeKeys = new Set(Object.keys(before || {}))
  const afterKeys = new Set(Object.keys(after || {}))

  // Find added and removed keys
  const addedKeys = [...afterKeys].filter((k) => !beforeKeys.has(k))
  const removedKeys = [...beforeKeys].filter((k) => !afterKeys.has(k))
  const commonKeys = [...beforeKeys].filter((k) => afterKeys.has(k))

  if (addedKeys.length > 0) {
    diff.added = {}
    addedKeys.forEach((k) => {
      diff.added![k] = after[k]
    })
  }

  if (removedKeys.length > 0) {
    diff.removed = {}
    removedKeys.forEach((k) => {
      diff.removed![k] = before[k]
    })
  }

  // Find modified values
  const modifiedRecord: Record<string, { before: any; after: any }> = {}
  commonKeys.forEach((k) => {
    const beforeVal = before[k]
    const afterVal = after[k]
    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      modifiedRecord[k] = { before: beforeVal, after: afterVal }
    }
  })

  if (Object.keys(modifiedRecord).length > 0) {
    diff.modified = modifiedRecord
  }

  return diff
}

/**
 * Generate a human-readable diff summary
 */
export function summarizeDiff(diff: DiffRecord): string {
  const parts: string[] = []

  if (diff.added && Object.keys(diff.added).length > 0) {
    parts.push(`Added: ${Object.keys(diff.added).join(', ')}`)
  }

  if (diff.removed && Object.keys(diff.removed).length > 0) {
    parts.push(`Removed: ${Object.keys(diff.removed).join(', ')}`)
  }

  if (diff.modified && Object.keys(diff.modified).length > 0) {
    const changes = Object.keys(diff.modified).map((k) => `${k} (${diff.modified![k].before} → ${diff.modified![k].after})`).join(', ')
    parts.push(`Modified: ${changes}`)
  }

  return parts.join('; ')
}
