/**
 * Permission Engine - RBAC (Role-Based Access Control)
 * Evaluates permissions based on user roles and actions
 */
export interface Permission {
  resource: string
  action: string
  description?: string
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}

export class PermissionEngine {
  private roles: Map<string, Role> = new Map()
  private permissionCache: Map<string, Set<string>> = new Map()

  registerRole(role: Role): void {
    this.roles.set(role.id, role)
    this.clearCache(role.id)
  }

  unregisterRole(roleId: string): void {
    this.roles.delete(roleId)
    this.clearCache(roleId)
  }

  hasPermission(roleId: string, resource: string, action: string): boolean {
    const cacheKey = `${roleId}:${resource}:${action}`
    const role = this.roles.get(roleId)

    if (!role) {
      return false
    }

    return role.permissions.some((p) => p.resource === resource && p.action === action)
  }

  hasAnyPermission(roleId: string, permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(roleId, p.resource, p.action))
  }

  hasAllPermissions(roleId: string, permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(roleId, p.resource, p.action))
  }

  getPermissionsForRole(roleId: string): Permission[] {
    return this.roles.get(roleId)?.permissions || []
  }

  private clearCache(roleId: string): void {
    const keys = Array.from(this.permissionCache.keys())
    keys.forEach((k) => {
      if (k.startsWith(roleId)) {
        this.permissionCache.delete(k)
      }
    })
  }
}

export const permissionEngine = new PermissionEngine()
