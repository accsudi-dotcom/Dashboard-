/**
 * Sharoobi Console - Auth Store
 * Manages authentication state, session, and user permissions
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser, PermissionRule } from '@/types/domain'

interface AuthState {
  user: AdminUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isHydrated: boolean
  error: string | null

  // Actions
  setUser: (user: AdminUser, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setHydrated: (hydrated: boolean) => void
  hasPermission: (resource: string, action: string, conditions?: Record<string, unknown>) => boolean
  canPerform: (resource: string, action: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isHydrated: false,
      error: null,

      setUser: (user: AdminUser, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
        // Clear localStorage on logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated })
      },

      hasPermission: (resource: string, action: string, conditions?: Record<string, unknown>) => {
        const { user } = get()
        if (!user) return false

        // Super admin has all permissions
        if (user.role === 'super_admin') return true

        // Check if user has permission rule for this resource
        const permission = user.permissions.find((p) => p.resource === resource)
        if (!permission) return false

        // Check if action is allowed
        if (!permission.actions.includes(action as any)) return false

        // Check conditions if provided
        if (conditions && permission.conditions) {
          const conditionKeys = Object.keys(permission.conditions)
          for (const key of conditionKeys) {
            if (permission.conditions[key as keyof typeof permission.conditions] !== conditions[key]) {
              return false
            }
          }
        }

        return true
      },

      canPerform: (resource: string, action: string) => {
        return get().hasPermission(resource, action)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after rehydration from localStorage
        if (state) {
          state.isHydrated = true
        }
      },
    }
  )
)
