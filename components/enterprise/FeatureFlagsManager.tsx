'use client'

import React, { useState } from 'react'
import { Eye, Edit2, Trash2, Plus, Code } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

const mockFlags = [
  {
    id: '1',
    name: 'new_dashboard',
    description: 'New dashboard redesign',
    enabled: true,
    rollout: 45,
    targeting: 'users,regions:US,EU',
    lastUpdated: '2024-02-14',
  },
  {
    id: '2',
    name: 'advanced_analytics',
    description: 'Advanced analytics features',
    enabled: true,
    rollout: 25,
    targeting: 'admin,pro_users',
    lastUpdated: '2024-02-13',
  },
  {
    id: '3',
    name: 'beta_ai_features',
    description: 'AI-powered recommendations',
    enabled: false,
    rollout: 10,
    targeting: 'beta_testers',
    lastUpdated: '2024-02-12',
  },
  {
    id: '4',
    name: 'payment_v2',
    description: 'New payment processing',
    enabled: true,
    rollout: 100,
    targeting: 'all',
    lastUpdated: '2024-02-10',
  },
]

export function FeatureFlagsManager() {
  const [flags, setFlags] = useState(mockFlags)

  const handleToggle = (flagId: string) => {
    setFlags(
      flags.map((f) => (f.id === flagId ? { ...f, enabled: !f.enabled } : f))
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Feature Flags</CardTitle>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Flag
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-slate-900">{flag.name}</h4>
                    <Badge variant="outline">
                      {flag.rollout}% rollout
                    </Badge>
                    {flag.enabled && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{flag.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span>Targeting: {flag.targeting}</span>
                    <span>Updated: {flag.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => handleToggle(flag.id)}
                  />
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
