/**
 * Sharoobi Console - UI Store
 * Manages global UI state: inspector panel, modals, theme, sidebar, etc.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type InspectorEntityType =
  | 'user'
  | 'provider'
  | 'order'
  | 'payment'
  | 'ticket'
  | 'device'
  | 'session'
  | null

interface InspectorState {
  entityType: InspectorEntityType
  entityId: string | null
  activeTab: 'details' | 'actions' | 'timeline' | 'relationships' | 'audit'
}

interface UIState {
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Inspector Panel (Right Drawer)
  inspector: InspectorState | null
  openInspector: (entityType: InspectorEntityType, entityId: string) => void
  closeInspector: () => void
  setInspectorTab: (tab: InspectorState['activeTab']) => void

  // Global modals
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void

  // Global notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    timestamp: number
  }>
  addNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void
  removeNotification: (id: string) => void

  // Command palette
  commandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void

  // Search state
  globalSearchQuery: string
  setGlobalSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme)
          if (theme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },

      sidebarOpen: true,
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      inspector: null,
      openInspector: (entityType: InspectorEntityType, entityId: string) => {
        set({
          inspector: {
            entityType,
            entityId,
            activeTab: 'details',
          },
        })
      },
      closeInspector: () => {
        set({ inspector: null })
      },
      setInspectorTab: (tab: InspectorState['activeTab']) => {
        set((state) => {
          if (state.inspector) {
            return {
              inspector: {
                ...state.inspector,
                activeTab: tab,
              },
            }
          }
          return state
        })
      },

      modals: {},
      openModal: (modalId: string) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        }))
      },
      closeModal: (modalId: string) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        }))
      },
      closeAllModals: () => {
        set({ modals: {} })
      },

      notifications: [],
      addNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        const id = Math.random().toString(36).slice(2)
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id, type, message, timestamp: Date.now() },
          ],
        }))
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id)
        }, 5000)
      },
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      commandPaletteOpen: false,
      openCommandPalette: () => {
        set({ commandPaletteOpen: true })
      },
      closeCommandPalette: () => {
        set({ commandPaletteOpen: false })
      },

      globalSearchQuery: '',
      setGlobalSearchQuery: (query: string) => {
        set({ globalSearchQuery: query })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
