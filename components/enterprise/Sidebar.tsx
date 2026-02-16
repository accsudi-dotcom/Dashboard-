'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Shield,
  Settings,
  BarChart3,
  Zap,
  Webhook,
  GitBranch,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/enterprise/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/enterprise/users', icon: Users },
  { name: 'Orders', href: '/enterprise/orders', icon: ShoppingCart },
  { name: 'Payments', href: '/enterprise/payments', icon: CreditCard },
  { name: 'Security', href: '/enterprise/security', icon: Shield },
  { name: 'Analytics', href: '/enterprise/analytics', icon: BarChart3 },
  { name: 'Feature Flags', href: '/enterprise/flags', icon: Zap },
  { name: 'Webhooks', href: '/enterprise/webhooks', icon: Webhook },
  { name: 'Workflows', href: '/enterprise/workflows', icon: GitBranch },
  { name: 'Settings', href: '/enterprise/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Sharoobi</h1>
            <p className="text-xs text-slate-400">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm text-white font-medium">admin@sharoobi.local</p>
        </div>
        <button className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-red-400 transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
