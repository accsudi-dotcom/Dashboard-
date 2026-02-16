'use client'

import { AlertCircle, Plus, Filter, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QueueItem } from '@/components/queues/QueueItem'
import { StatCard } from '@/components/stats/StatCard'

const mockFlags = [
  {
    id: 'FLAG-4521',
    title: 'Inappropriate Review - Provider Profile',
    description: 'Offensive language in customer review',
    priority: 'high' as const,
    status: 'pending' as const,
    time: '8 mins ago',
  },
  {
    id: 'FLAG-4520',
    title: 'Suspicious Provider Listing',
    description: 'Multiple policy violations detected',
    priority: 'critical' as const,
    status: 'pending' as const,
    time: '22 mins ago',
  },
]

export default function ModerationPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Moderation Workspace</h1>
            <p className="text-muted-foreground mt-2">Content moderation, user flags, and appeals management</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Review
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Pending Reviews" value="34" change={2} description="vs yesterday" icon={<Flag className="h-5 w-5" />} color="warning" />
          <StatCard title="Escalated" value="8" color="destructive" icon={<AlertCircle className="h-5 w-5" />} />
          <StatCard title="Approved Today" value="156" change={12} color="success" icon={<Flag className="h-5 w-5" />} />
          <StatCard title="Appeals" value="12" color="warning" icon={<Flag className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Flagged Content Queue
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFlags.map((flag) => (
              <QueueItem
                key={flag.id}
                {...flag}
                actions={[
                  { label: 'Approve', onClick: () => {} },
                  { label: 'Remove', onClick: () => {} },
                ]}
              />
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Review Time</span>
                  <span className="text-sm font-medium">3.2 mins</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-blue-600 w-2/3 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Appeal Resolution Rate</span>
                  <span className="text-sm font-medium">82.5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">Review Appeals</Button>
              <Button className="w-full justify-start" variant="outline">Generate Report</Button>
              <Button className="w-full justify-start" variant="outline">View Audit Log</Button>
              <Button className="w-full justify-start" variant="outline">Escalate to Admin</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
