'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Lock, Shield, Eye, Clock } from 'lucide-react'

export default function SecurityPage() {
  const [events] = useState([
    {
      id: 'SEC-001',
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'critical',
      message: 'Failed login attempts from IP 192.168.1.1',
      timestamp: '2024-06-10 14:32:00',
      ip: '192.168.1.1',
      user: 'user@example.com',
    },
    {
      id: 'SEC-002',
      type: 'PERMISSION_DENIED',
      severity: 'warning',
      message: 'User attempted to access restricted resource',
      timestamp: '2024-06-10 13:15:00',
      ip: '10.0.0.5',
      user: 'manager@example.com',
    },
    {
      id: 'SEC-003',
      type: 'DATA_ACCESS',
      severity: 'info',
      message: 'Sensitive data export initiated',
      timestamp: '2024-06-10 12:00:00',
      ip: '10.0.0.10',
      user: 'admin@example.com',
    },
    {
      id: 'SEC-004',
      type: 'CONFIGURATION_CHANGE',
      severity: 'warning',
      message: 'API key rotated',
      timestamp: '2024-06-10 10:45:00',
      ip: '10.0.0.15',
      user: 'admin@example.com',
    },
  ])

  const severityColor = {
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const stats = [
    {
      label: 'Critical Events',
      value: 12,
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
    },
    {
      label: 'Warning Events',
      value: 45,
      icon: <Shield className="h-6 w-6 text-yellow-600" />,
    },
    {
      label: 'Info Events',
      value: 234,
      icon: <Eye className="h-6 w-6 text-blue-600" />,
    },
    {
      label: 'This Month',
      value: '291',
      icon: <Clock className="h-6 w-6 text-purple-600" />,
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Monitoring</h1>
          <p className="text-muted-foreground mt-2">Real-time threat detection and security events</p>
        </div>
        <Button>Generate Security Report</Button>
      </div>

      {/* Critical Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          12 critical security events detected in the last 24 hours. Review and take action immediately.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={severityColor[event.severity as keyof typeof severityColor]}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <p className="font-mono text-sm text-muted-foreground">{event.id}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                    </div>
                    <p className="font-medium mb-2">{event.message}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>User: {event.user}</span>
                      <span>IP: {event.ip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Policies</CardTitle>
              <CardDescription>Currently enforced policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">MFA Required</p>
                    <p className="text-sm text-muted-foreground">All admin users must use MFA</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">Restrict access to approved IPs</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">Password Policy</p>
                    <p className="text-sm text-muted-foreground">Enforce strong password rules</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>All administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">User created: john.doe@example.com</p>
                    <p className="text-xs text-muted-foreground">by: admin@example.com</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2024-06-10 15:23</p>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Permission changed: USER → MANAGER</p>
                    <p className="text-xs text-muted-foreground">User: jane.smith@example.com</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2024-06-10 14:10</p>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">API key rotated</p>
                    <p className="text-xs text-muted-foreground">by: admin@example.com</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2024-06-10 12:45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
