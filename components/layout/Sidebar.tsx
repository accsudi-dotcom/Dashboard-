'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutGrid,
  Users,
  Store,
  ShoppingCart,
  CreditCard,
  Ticket,
  Lock,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
  Zap,
  Cog,
  AlertCircle,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface MenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number | string
}

const menuSections: MenuSection[] = [
  {
    title: 'Operations',
    items: [
      { label: 'Command Center', href: '/dashboard/command-center', icon: LayoutGrid },
    ],
  },
  {
    title: 'Workspaces',
    items: [
      { label: 'Support', href: '/dashboard/support', icon: Ticket, badge: 12 },
      { label: 'Operations', href: '/dashboard/ops', icon: ShoppingCart, badge: 5 },
      { label: 'Finance', href: '/dashboard/finance', icon: CreditCard, badge: 3 },
      { label: 'Moderation', href: '/dashboard/moderation', icon: AlertCircle },
      { label: 'Security', href: '/dashboard/security', icon: Lock },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'App Experience', href: '/dashboard/studios/app-experience', icon: Zap },
      { label: 'Rules Engine', href: '/dashboard/studios/rules', icon: Cog },
      { label: 'Pricing', href: '/dashboard/studios/pricing', icon: Database },
      { label: 'Permissions', href: '/dashboard/studios/permissions', icon: Lock },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Audit Log', href: '/dashboard/governance/audit', icon: FileText },
      { label: 'Security Events', href: '/dashboard/governance/security-events', icon: AlertCircle },
      { label: 'Sessions', href: '/dashboard/governance/sessions', icon: Users },
      { label: 'Devices', href: '/dashboard/governance/devices', icon: Ticket },
    ],
  },
  {
    title: 'Entities',
    items: [
      { label: 'Users', href: '/dashboard/entities/users', icon: Users },
      { label: 'Providers', href: '/dashboard/entities/providers', icon: Store },
      { label: 'Orders', href: '/dashboard/entities/orders', icon: ShoppingCart },
      { label: 'Payments', href: '/dashboard/entities/payments', icon: CreditCard },
      { label: 'Wallet Ledger', href: '/dashboard/entities/wallet', icon: CreditCard },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Operations', 'Workspaces'])
  )

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href)

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-sidebar hover:bg-sidebar-accent"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 z-40 overflow-y-auto',
          !sidebarOpen && 'lg:hidden -translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="sticky top-0 h-16 flex items-center gap-3 px-4 border-b border-sidebar-border bg-sidebar/95 backdrop-blur">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">SC</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-sidebar-primary truncate">Sharoobi</h1>
            <p className="text-xs text-sidebar-foreground/60">Console</p>
          </div>
        </div>

        {/* Menu Sections */}
        <nav className="p-3 space-y-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide hover:text-sidebar-foreground transition-colors group"
              >
                <span>{section.title}</span>
                <ChevronRight
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expandedSections.has(section.title) && 'rotate-90'
                  )}
                />
              </button>

              {/* Menu Items */}
              {expandedSections.has(section.title) && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          active
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border bg-sidebar/95 backdrop-blur">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
