'use client'

import { useAuthStore } from '@/stores/auth'
import type { PermissionRule } from '@/types/domain'

/**
 * Hook for checking user permissions
 * Returns true if user has required permission
 */
export function usePermissions() {
  const { user } = useAuthStore()

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false

    // Super admin has all permissions
    if (user.role === 'super_admin') return true

    // Check if user has the permission
    const permission = user.permissions?.find((p: PermissionRule) => p.resource === resource && p.actions?.includes(action))

    return !!permission
  }

  const canView = (resource: string): boolean => hasPermission(resource, 'view')
  const canCreate = (resource: string): boolean => hasPermission(resource, 'create')
  const canUpdate = (resource: string): boolean => hasPermission(resource, 'update')
  const canDelete = (resource: string): boolean => hasPermission(resource, 'delete')
  const canApprove = (resource: string): boolean => hasPermission(resource, 'approve')

  return {
    hasPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canApprove,
    user,
  }
}
