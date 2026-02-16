import { User, UserRole, UserStatus } from '../domain/User'
import { UserRepository } from '../infrastructure/UserRepository'
import { ConflictError, NotFoundError, UnauthorizedError } from '@/core/domain/errors/DomainError'
import { globalUnitOfWork } from '@/core/infrastructure/UnitOfWork'
import { auditTrail } from '@/core/infrastructure/AuditTrail'
import { tenantContext } from '@/core/infrastructure/TenantContext'
import { permissionEngine } from '@/core/infrastructure/PermissionEngine'
import { observabilityService } from '@/core/infrastructure/ObservabilityService'
import { v4 as uuid } from 'uuid'

/**
 * User Service - Application layer
 * Orchestrates domain objects and infrastructure
 * Implements use cases and business logic coordination
 */
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(
    email: string,
    plainPassword: string,
    name: string,
    role: UserRole,
    reason?: string,
    correlationId?: string
  ): Promise<User> {
    const user = tenantContext.requireUser()
    const tenant = tenantContext.requireTenant()

    // Permission check
    if (!permissionEngine.hasPermission(user.role, 'users', 'create')) {
      throw new UnauthorizedError('Permission denied: cannot create users')
    }

    // Check if email already exists
    const exists = await this.repository.existsByEmail(email)
    if (exists) {
      throw new ConflictError(`Email already in use: ${email}`)
    }

    // Create user
    const newUser = User.create(uuid(), email, plainPassword, name, tenant.tenantId, role)

    // Save to repository
    await this.repository.save(newUser)
    globalUnitOfWork.registerNew(newUser)
    await globalUnitOfWork.commit()

    // Audit
    auditTrail.record({
      actor: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        ipAddress: user.ipAddress,
        deviceId: user.deviceId,
        sessionId: user.sessionId,
      },
      action: 'user_created',
      resourceType: 'User',
      resourceId: newUser.getId(),
      changes: {
        before: {},
        after: newUser.toPrimitives(),
        diff: { created: true },
      },
      reason: reason || 'User creation',
      status: 'success',
      tenantId: tenant.tenantId,
    })

    observabilityService.info('User created', { userId: newUser.getId(), email }, correlationId)

    return newUser
  }

  async getUserById(userId: string): Promise<User> {
    const tenant = tenantContext.requireTenant()

    const user = await this.repository.findById(userId)
    if (!user) {
      throw new NotFoundError(`User not found: ${userId}`)
    }

    if (user.getTenantId() !== tenant.tenantId) {
      throw new UnauthorizedError('User belongs to different tenant')
    }

    return user
  }

  async getUserByEmail(email: string): Promise<User> {
    const tenant = tenantContext.requireTenant()

    const user = await this.repository.findByEmail(email)
    if (!user) {
      throw new NotFoundError(`User not found: ${email}`)
    }

    if (user.getTenantId() !== tenant.tenantId) {
      throw new UnauthorizedError('User belongs to different tenant')
    }

    return user
  }

  async suspendUser(userId: string, reason?: string, correlationId?: string): Promise<void> {
    const actor = tenantContext.requireUser()
    const tenant = tenantContext.requireTenant()

    if (!permissionEngine.hasPermission(actor.role, 'users', 'update')) {
      throw new UnauthorizedError('Permission denied: cannot update users')
    }

    const user = await this.getUserById(userId)
    const before = user.toPrimitives()

    user.suspend(reason || 'Admin action')

    await this.repository.save(user)
    globalUnitOfWork.registerChanged(user)
    await globalUnitOfWork.commit()

    // Audit
    auditTrail.record({
      actor: {
        userId: actor.userId,
        email: actor.email,
        role: actor.role,
        ipAddress: actor.ipAddress,
        deviceId: actor.deviceId,
        sessionId: actor.sessionId,
      },
      action: 'user_suspended',
      resourceType: 'User',
      resourceId: userId,
      changes: {
        before,
        after: user.toPrimitives(),
        diff: { status: { from: before.status, to: user.getStatus() } },
      },
      reason: reason || 'User suspension',
      status: 'success',
      tenantId: tenant.tenantId,
    })

    observabilityService.info('User suspended', { userId }, correlationId)
  }

  async deleteUser(userId: string, reason?: string, correlationId?: string): Promise<void> {
    const actor = tenantContext.requireUser()
    const tenant = tenantContext.requireTenant()

    if (!permissionEngine.hasPermission(actor.role, 'users', 'delete')) {
      throw new UnauthorizedError('Permission denied: cannot delete users')
    }

    const user = await this.getUserById(userId)
    const before = user.toPrimitives()

    user.delete()

    await this.repository.save(user)
    globalUnitOfWork.registerChanged(user)
    await globalUnitOfWork.commit()

    // Audit
    auditTrail.record({
      actor: {
        userId: actor.userId,
        email: actor.email,
        role: actor.role,
        ipAddress: actor.ipAddress,
        deviceId: actor.deviceId,
        sessionId: actor.sessionId,
      },
      action: 'user_deleted',
      resourceType: 'User',
      resourceId: userId,
      changes: {
        before,
        after: user.toPrimitives(),
        diff: { status: { from: before.status, to: user.getStatus() } },
      },
      reason: reason || 'User deletion',
      status: 'success',
      tenantId: tenant.tenantId,
    })

    observabilityService.info('User deleted', { userId }, correlationId)
  }

  async listTenantUsers(): Promise<User[]> {
    const tenant = tenantContext.requireTenant()
    return this.repository.findByTenant(tenant.tenantId)
  }
}
