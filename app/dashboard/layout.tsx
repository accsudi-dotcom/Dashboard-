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
  const { isAuthenticated } = useAuthStore()
  const { sidebarOpen } = useUIStore()
  const [mounted, setMounted] = useState(false)

  // Wait for client-side hydration before checking auth
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication after hydration
  useEffect(() => {
    if (!mounted) return
    
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router, mounted])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

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
