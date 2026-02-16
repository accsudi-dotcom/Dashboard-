'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Settings, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  status: 'active' | 'inactive' | 'scheduled'
  rolloutPercentage: number
  targetSegments: string[]
  createdAt: string
  createdBy: string
  lastModified: string
}

const mockFlags: FeatureFlag[] = [
  {
    id: 'FF-001',
    name: 'Dark Mode Support',
    key: 'dark_mode',
    description: 'Enable dark theme across the platform',
    status: 'active',
    rolloutPercentage: 100,
    targetSegments: ['all_users'],
    createdAt: '2024-01-15',
    createdBy: 'admin@sharoobi.local',
    lastModified: '2024-02-01',
  },
  {
    id: 'FF-002',
    name: 'Advanced Search',
    key: 'advanced_search',
    description: 'New AI-powered search functionality',
    status: 'active',
    rolloutPercentage: 50,
    targetSegments: ['beta_users', 'admin'],
    createdAt: '2024-01-20',
    createdBy: 'admin@sharoobi.local',
    lastModified: '2024-02-03',
  },
  {
    id: 'FF-003',
    name: 'Real-time Notifications',
    key: 'realtime_notifications',
    description: 'WebSocket-based real-time alerts',
    status: 'scheduled',
    rolloutPercentage: 0,
    targetSegments: [],
    createdAt: '2024-02-05',
    createdBy: 'admin@sharoobi.local',
    lastModified: '2024-02-05',
  },
  {
    id: 'FF-004',
    name: 'Bulk Operations',
    key: 'bulk_operations',
    description: 'Perform batch actions on multiple items',
    status: 'inactive',
    rolloutPercentage: 0,
    targetSegments: [],
    createdAt: '2024-01-10',
    createdBy: 'admin@sharoobi.local',
    lastModified: '2024-02-02',
  },
]

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(mockFlags)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
            <p className="text-muted-foreground mt-2">Control feature rollout and A/B testing with dynamic flags</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Flag
          </Button>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search flags by name or key..." className="flex-1" />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Flags</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold mt-1">1</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Beta Users</p>
              <p className="text-2xl font-bold mt-1">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Flags</p>
              <p className="text-2xl font-bold mt-1">4</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feature Flags Registry</CardTitle>
            <CardDescription>Manage and monitor all active feature flags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {flags.map((flag) => (
              <div key={flag.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{flag.name}</span>
                      <Badge className={flag.status === 'active' ? 'bg-green-600' : flag.status === 'scheduled' ? 'bg-blue-600' : 'bg-slate-600'}>
                        {flag.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded inline-block">{flag.key}</p>
                    <p className="text-sm text-muted-foreground mt-2">{flag.description}</p>
                    
                    {flag.status === 'active' && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Rollout: {flag.rolloutPercentage}%</span>
                          <span className="text-xs text-muted-foreground">{flag.rolloutPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full" 
                            style={{ width: `${flag.rolloutPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Created: {flag.createdAt}</span>
                      <span>By: {flag.createdBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowDetails(showDetails === flag.id ? null : flag.id)}
                    >
                      {showDetails === flag.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showDetails === flag.id && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Target Segments:</span>
                        <p className="font-mono text-xs">{flag.targetSegments.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Modified:</span>
                        <p className="font-mono text-xs">{flag.lastModified}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
