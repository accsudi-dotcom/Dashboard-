'use client'

import { Lock, Plus, Filter, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QueueItem } from '@/components/queues/QueueItem'
import { StatCard } from '@/components/stats/StatCard'

const mockSecurityEvents = [
  {
    id: 'SEC-9821',
    title: 'Failed OTP Attempt x5 - User 542',
    description: 'Multiple failed authentication attempts',
    priority: 'high' as const,
    status: 'pending' as const,
    time: '3 mins ago',
  },
  {
    id: 'SEC-9820',
    title: 'Suspicious Device Pairing',
    description: 'New device from unusual location',
    priority: 'medium' as const,
    status: 'processing' as const,
    time: '28 mins ago',
    assignee: 'Security',
  },
]

export default function SecurityPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Workspace</h1>
            <p className="text-muted-foreground mt-2">Security events, risk management, and threat investigation</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Block User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Security Events" value="24" change={-5} description="vs yesterday" icon={<AlertTriangle className="h-5 w-5" />} color="warning" />
          <StatCard title="High Risk" value="3" color="destructive" icon={<Lock className="h-5 w-5" />} />
          <StatCard title="Blocked Users" value="12" change={2} color="warning" icon={<Lock className="h-5 w-5" />} />
          <StatCard title="Resolved" value="89%" change={3} color="success" icon={<Lock className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Events Queue
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSecurityEvents.map((event) => (
              <QueueItem
                key={event.id}
                {...event}
                actions={[
                  { label: 'Investigate', onClick: () => {} },
                  { label: 'Block', onClick: () => {} },
                ]}
              />
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Authentication Success Rate</span>
                  <span className="text-sm font-medium text-green-600">99.7%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '99%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fraud Detection Rate</span>
                  <span className="text-sm font-medium text-blue-600">94.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">Block Suspicious IPs</Button>
              <Button className="w-full justify-start" variant="outline">Force Password Reset</Button>
              <Button className="w-full justify-start" variant="outline">Review Device Registry</Button>
              <Button className="w-full justify-start" variant="outline">Generate Threat Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
