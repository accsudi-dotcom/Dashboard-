'use client'

import { AlertTriangle, Lock, Shield, TrendingUp, Plus, Search, Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const mockSecurityEvents = [
  {
    id: 'SEC-001',
    type: 'failed_login',
    severity: 'medium',
    user: 'user@example.com',
    ip: '192.168.1.100',
    timestamp: '2 mins ago',
    action: 'Block IP',
  },
  {
    id: 'SEC-002',
    type: 'suspicious_activity',
    severity: 'high',
    user: 'admin@sharoobi.local',
    ip: '203.45.67.89',
    timestamp: '15 mins ago',
    action: 'Force Logout',
  },
  {
    id: 'SEC-003',
    type: 'api_rate_limit',
    severity: 'low',
    user: 'service@api.local',
    ip: '10.0.0.1',
    timestamp: '1 hour ago',
    action: 'Throttle',
  },
]

export default function SecurityPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Management</h1>
            <p className="text-muted-foreground mt-2">Monitor security events and manage threat responses</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold mt-1">24</p>
              <p className="text-xs text-red-600 mt-1">3 critical</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Blocked IPs</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Failed Logins</p>
              <p className="text-2xl font-bold mt-1">87</p>
              <p className="text-xs text-yellow-600 mt-1">Last 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold mt-1 text-green-600">96%</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search security events..." className="flex-1" />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Real-time security monitoring and threat detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSecurityEvents.map((event) => (
              <div key={event.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {event.severity === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : event.severity === 'medium' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{event.type}</span>
                        <Badge className={event.severity === 'high' ? 'bg-red-600' : event.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <span>User: {event.user}</span>
                        <span>IP: {event.ip}</span>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Ban className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
