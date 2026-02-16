'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WorkspaceTab {
  id: string
  label: string
  badge?: number
  icon?: React.ReactNode
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  children: React.ReactNode
}

export function WorkspaceTabs({
  tabs,
  defaultTab = tabs[0]?.id,
  onTabChange,
  children,
}: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            className="rounded-none border-b-2"
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <Badge className="ml-2" variant="secondary">
                {tab.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}
