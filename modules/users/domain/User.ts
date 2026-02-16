import { Aggregate } from '@/core/domain/Aggregate'
import type { DomainEvent } from '@/core/domain/events/DomainEvent'
import { UserEmail } from './UserEmail'
import { UserPassword } from './UserPassword'
import { InvalidArgumentError, ConflictError } from '@/core/domain/errors/DomainError'

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

/**
 * User Aggregate Root
 * Represents a user in the system with full domain logic
 * Emits domain events for user lifecycle (created, activated, suspended, etc.)
 */
export class User extends Aggregate<string> {
  private email: UserEmail
  private password: UserPassword
  private name: string
  private status: UserStatus
  private role: UserRole
  private tenantId: string
  private lastLoginAt?: Date
  private mfaEnabled: boolean
  private permissions: string[]
  private metadata?: Record<string, any>

  constructor(
    id: string,
    email: UserEmail,
    password: UserPassword,
    name: string,
    tenantId: string,
    role: UserRole = UserRole.VIEWER,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt)
    this.email = email
    this.password = password
    this.name = name
    this.tenantId = tenantId
    this.role = role
    this.status = UserStatus.ACTIVE
    this.mfaEnabled = false
    this.permissions = []
    this.validate()
  }

  validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new InvalidArgumentError('User ID is required')
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidArgumentError('User name is required')
    }
    if (!this.tenantId || this.tenantId.trim().length === 0) {
      throw new InvalidArgumentError('Tenant ID is required')
    }
  }

  static create(
    id: string,
    email: string,
    plainPassword: string,
    name: string,
    tenantId: string,
    role: UserRole = UserRole.VIEWER
  ): User {
    const userEmail = UserEmail.create(email)
    const password = UserPassword.create(plainPassword)
    return new User(id, userEmail, password, name, tenantId, role)
  }

  getId(): string {
    return this.id
  }

  getEmail(): string {
    return this.email.getValue()
  }

  getName(): string {
    return this.name
  }

  getTenantId(): string {
    return this.tenantId
  }

  getRole(): UserRole {
    return this.role
  }

  getStatus(): UserStatus {
    return this.status
  }

  activate(): void {
    if (this.status === UserStatus.ACTIVE) {
      return
    }
    this.status = UserStatus.ACTIVE
    this.markAsUpdated()
  }

  suspend(reason: string): void {
    this.status = UserStatus.SUSPENDED
    this.markAsUpdated()
  }

  delete(): void {
    this.status = UserStatus.DELETED
    this.markAsUpdated()
  }

  updateProfile(name: string, metadata?: Record<string, any>): void {
    if (name && name.trim().length > 0) {
      this.name = name
    }
    if (metadata) {
      this.metadata = metadata
    }
    this.markAsUpdated()
  }

  changePassword(newPassword: string): void {
    this.password = UserPassword.create(newPassword)
    this.markAsUpdated()
  }

  authenticate(plainPassword: string): boolean {
    return this.password.matches(plainPassword)
  }

  recordLogin(): void {
    this.lastLoginAt = new Date()
    this.markAsUpdated()
  }

  enableMFA(): void {
    this.mfaEnabled = true
    this.markAsUpdated()
  }

  disableMFA(): void {
    this.mfaEnabled = false
    this.markAsUpdated()
  }

  grantPermission(permission: string): void {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission)
      this.markAsUpdated()
    }
  }

  revokePermission(permission: string): void {
    const index = this.permissions.indexOf(permission)
    if (index > -1) {
      this.permissions.splice(index, 1)
      this.markAsUpdated()
    }
  }

  applyEvent(event: DomainEvent): void {
    // Implementation for event sourcing
  }

  toPrimitives(): Record<string, any> {
    return {
      id: this.id,
      email: this.email.getValue(),
      password: this.password.toPrimitives(),
      name: this.name,
      status: this.status,
      role: this.role,
      tenantId: this.tenantId,
      lastLoginAt: this.lastLoginAt?.toISOString(),
      mfaEnabled: this.mfaEnabled,
      permissions: this.permissions,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      version: this.version,
    }
  }

  // Allow repository reconstruction to restore version safely
  setVersion(version: number): void {
    if (typeof version === 'number' && !Number.isNaN(version)) {
      // assign to protected member from within aggregate
      ;(this as any).version = version
    }
  }
}
