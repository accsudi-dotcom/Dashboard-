'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { InspectorPanel } from '@/components/layout/InspectorPanel'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { cn } from '@/lib/utils'

/**
 * Dashboard Layout
 * Main layout wrapper for authenticated sections
 * Includes: Sidebar, Topbar, Inspector Panel, and main content area
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isHydrated, setHydrated } = useAuthStore()
  const { sidebarOpen } = useUIStore()

  // Mark as hydrated once component mounts
  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  // Check authentication after hydration is confirmed
  useEffect(() => {
    // Only redirect if we've hydrated from localStorage AND user is not authenticated
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isHydrated, isAuthenticated, router])

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated after hydration, don't render dashboard (redirect will handle)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Inspector Panel (Right Drawer) */}
      <InspectorPanel />
    </div>
  )
}
