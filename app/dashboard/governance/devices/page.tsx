'use client'

import { Smartphone, Tablet, Monitor, Trash2, Shield, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockDevices = [
  {
    id: 'DEV-001',
    fingerprint: 'a7e2c5f8b3d1e4g9h2j5k8l1m4n7o0p3q',
    deviceName: 'iPhone 14 Pro',
    type: 'mobile',
    os: 'iOS 17.2',
    user: 'Ahmed Hassan',
    lastSeen: '2 mins ago',
    trustScore: 95,
    status: 'trusted',
  },
  {
    id: 'DEV-002',
    fingerprint: 'b2f7k3m9n4p6q1r8s2t5u9v3w7x1y4z8a',
    deviceName: 'Unknown Android Device',
    type: 'mobile',
    os: 'Android 13',
    user: 'Ahmed Hassan',
    lastSeen: '45 mins ago',
    trustScore: 25,
    status: 'suspicious',
  },
  {
    id: 'DEV-003',
    fingerprint: 'c5k9m2p7r3s8t1u6v4w2x9y5z1a4b8c2d',
    deviceName: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS 14.2',
    user: 'Fatima Ali',
    lastSeen: '30 secs ago',
    trustScore: 98,
    status: 'trusted',
  },
]

export default function DevicesPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
            <p className="text-muted-foreground mt-2">Monitor registered devices and manage device security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Trusted</p>
              <p className="text-2xl font-bold mt-1 text-green-600">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Suspicious</p>
              <p className="text-2xl font-bold mt-1 text-red-600">1</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Trust Score</p>
              <p className="text-2xl font-bold mt-1">73%</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search devices by name or fingerprint..." className="flex-1" />
          <Button variant="outline">Search</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Device Registry</CardTitle>
            <CardDescription>All devices registered on user accounts with trust scoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDevices.map((device) => (
              <div key={device.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {device.type === 'mobile' && <Smartphone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                    {device.type === 'desktop' && <Monitor className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                    {device.type === 'tablet' && <Tablet className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold">{device.deviceName}</span>
                        {device.status === 'suspicious' && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={device.status === 'trusted' ? 'default' : 'destructive'}>
                          {device.status}
                        </Badge>
                        <Badge variant="secondary">Trust: {device.trustScore}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono break-all mb-2">
                        ID: {device.fingerprint.slice(0, 24)}...
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{device.os}</p>
                        <div className="flex items-center gap-4">
                          <span>User: {device.user}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last seen: {device.lastSeen}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={device.trustScore >= 80 ? 'h-full bg-green-600' : device.trustScore >= 50 ? 'h-full bg-yellow-600' : 'h-full bg-red-600'}
                          style={{ width: `${device.trustScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost">
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
