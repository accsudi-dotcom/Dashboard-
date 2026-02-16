import { BaseRepository } from '@/core/infrastructure/BaseRepository'
import { InMemoryStore } from '@/core/infrastructure/InMemoryStore'
import { User, UserRole, UserStatus } from '../domain/User'
import { UserEmail } from '../domain/UserEmail'
import { UserPassword } from '../domain/UserPassword'
import { NotFoundError } from '@/core/domain/errors/DomainError'

export class UserRepository extends BaseRepository<User, string> {
  private emailIndex: Map<string, string> = new Map()

  constructor(store: InMemoryStore) {
    super('users', store)
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email.toLowerCase())
    if (!userId) return null
    return this.findById(userId)
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    const allUsers = await this.findAll()
    return allUsers.filter((u) => u.getTenantId() === tenantId)
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const allUsers = await this.findAll()
    return allUsers.filter((u) => u.getRole() === role)
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const allUsers = await this.findAll()
    return allUsers.filter((u) => u.getStatus() === status)
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.emailIndex.has(email.toLowerCase())
  }

  async save(user: User): Promise<void> {
    await super.save(user)
    // Update email index
    this.emailIndex.set(user.getEmail().toLowerCase(), user.getId())
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id)
    if (user) {
      this.emailIndex.delete(user.getEmail().toLowerCase())
    }
    await super.delete(id)
  }

  protected reconstruct(data: Record<string, any>): User {
    const email = UserEmail.create(data.email)
    const password = new UserPassword(data.password)
    const user = new User(
      data.id,
      email,
      password,
      data.name,
      data.tenantId,
      data.role || UserRole.VIEWER,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    )

    // Restore state
    if (data.status === UserStatus.SUSPENDED) user.suspend('restored')
    if (data.status === UserStatus.DELETED) user.delete()
    if (data.lastLoginAt) {
      user.recordLogin()
    }
    if (data.mfaEnabled) {
      user.enableMFA()
    }
    if (data.permissions && Array.isArray(data.permissions)) {
      data.permissions.forEach((p: string) => user.grantPermission(p))
    }

    user.setVersion(data.version || 0)
    return user
  }
}
