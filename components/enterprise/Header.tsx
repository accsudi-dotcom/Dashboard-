'use client'

import React, { useState } from 'react'
import { Search, Bell, Settings, MoreVertical, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                {notifications}
              </Badge>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          {/* Menu */}
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
