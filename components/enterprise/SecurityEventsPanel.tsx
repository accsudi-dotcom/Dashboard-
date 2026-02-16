'use client'

import React, { useState } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockSecurityEvents = [
  {
    id: '1',
    type: 'failed_login',
    severity: 'medium',
    description: 'Failed login attempt from IP 192.168.1.1',
    timestamp: '2024-02-14 14:32',
    user: 'john@example.com',
  },
  {
    id: '2',
    type: 'permission_denied',
    severity: 'low',
    description: 'User tried to access restricted resource',
    timestamp: '2024-02-14 13:15',
    user: 'jane@example.com',
  },
  {
    id: '3',
    type: 'suspicious_activity',
    severity: 'high',
    description: 'Multiple API requests from unusual location',
    timestamp: '2024-02-14 12:45',
    user: 'bob@example.com',
  },
  {
    id: '4',
    type: 'config_change',
    severity: 'high',
    description: 'Security configuration modified',
    timestamp: '2024-02-14 11:20',
    user: 'admin@sharoobi.local',
  },
]

export function SecurityEventsPanel() {
  const [events, setEvents] = useState(mockSecurityEvents)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const filteredEvents = events.filter((e) => filter === 'all' || e.severity === filter)

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Security Events</CardTitle>
          <div className="flex gap-2">
            {(['all', 'high', 'medium'] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No security events</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(event.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {event.description}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getSeverityBadge(event.severity)}
                      >
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      User: {event.user}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {event.timestamp}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
