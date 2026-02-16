'use client'

import { X, Clock, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUIStore } from '@/stores/ui'
import { cn } from '@/lib/utils'

interface InspectorTabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: InspectorTabItem[] = [
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'actions', label: 'Actions', icon: AlertCircle },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'relationships', label: 'Relations', icon: LinkIcon },
  { id: 'audit', label: 'Audit', icon: FileText },
]

/**
 * Inspector Panel (Right Drawer)
 * Shows detailed information about a selected entity
 */
export function InspectorPanel() {
  const { inspector, closeInspector, setInspectorTab } = useUIStore()

  if (!inspector) return null

  const activeTab = inspector.activeTab
  const Icon = (tabs.find((t) => t.id === activeTab)?.icon || FileText) as React.ComponentType<{
    className?: string
  }>

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={closeInspector}
      />

      {/* Panel */}
      <aside className={cn(
        'fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50 flex flex-col',
        'transform transition-transform duration-300 ease-in-out',
        inspector ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground capitalize">
                {inspector.entityType}
              </p>
              <p className="text-sm font-semibold truncate">
                {inspector.entityId}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeInspector}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <ScrollArea className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setInspectorTab(value as any)}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-b-transparent text-xs px-4"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Content */}
            <TabsContent value="details" className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">ID</p>
                  <p className="text-sm font-mono text-foreground">{inspector.entityId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Type</p>
                  <p className="text-sm capitalize text-foreground">
                    {inspector.entityType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="p-4 space-y-3">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  View Full Details
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Edit Entity
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm text-destructive hover:text-destructive"
                >
                  Suspend/Block
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="p-4 space-y-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Status updated</p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-border bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Related Orders
                  </p>
                  <p className="text-sm text-foreground mt-1">5 orders</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Related Payments
                  </p>
                  <p className="text-sm text-foreground mt-1">3 payments</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="p-4 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg border border-border text-xs">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium">User status changed</p>
                      <span className="text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-muted-foreground">By: admin@sharoobi.local</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </aside>
    </>
  )
}
