'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingCart, CreditCard, Lock, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { label: 'Dashboard', href: '/enterprise/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/enterprise/users', icon: Users },
    { label: 'Orders', href: '/enterprise/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/enterprise/payments', icon: CreditCard },
    { label: 'Security', href: '/enterprise/security', icon: Lock },
    { label: 'Settings', href: '/enterprise/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">Sharoobi</h1>
          <p className="text-xs text-muted-foreground mt-1">Enterprise Console</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent text-sm hover:text-accent-foreground cursor-pointer transition-colors">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <p className="text-xs text-muted-foreground text-center">v1.0.0 Enterprise</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>
    </div>
  )
}
