'use client'

import { Smartphone, LogOut, Eye, Globe, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockSessions = [
  {
    id: 'SES-001',
    user: 'Ahmed Hassan',
    device: 'Chrome on Windows',
    ip: '192.168.1.100',
    location: 'Cairo, Egypt',
    lastActive: '1 min ago',
    duration: '2h 34m',
    status: 'active',
  },
  {
    id: 'SES-002',
    user: 'Fatima Ali',
    device: 'Safari on iPhone',
    ip: '203.0.113.45',
    location: 'Alexandria, Egypt',
    lastActive: '5 mins ago',
    duration: '1h 12m',
    status: 'active',
  },
  {
    id: 'SES-003',
    user: 'Admin System',
    device: 'API Client',
    ip: '10.0.0.1',
    location: 'Internal',
    lastActive: '30 secs ago',
    duration: '48h 12m',
    status: 'active',
  },
]

export default function SessionsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Session Management</h1>
            <p className="text-muted-foreground mt-2">Monitor active sessions and manage user logins across devices</p>
          </div>
          <Button variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unique Users</p>
              <p className="text-2xl font-bold mt-1">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold mt-1">17.3h</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search by user, IP, or device..." className="flex-1" />
          <Button variant="outline">Search</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>All user sessions currently active across the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Smartphone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{session.user}</span>
                        <Badge className="bg-green-600">{session.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{session.device}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span>{session.ip}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Last: {session.lastActive}</span>
                          </div>
                          <span className="text-muted-foreground">Duration: {session.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive">
                    <LogOut className="h-4 w-4" />
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
