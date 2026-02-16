'use client'

import { FileText, Search, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Timeline, TimelineEvent } from '@/components/timeline/Timeline'

const mockAuditEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: '2 mins ago',
    title: 'User Blocked',
    description: 'User #5421 blocked for suspicious activity',
    actor: 'security-admin',
    type: 'warning',
    metadata: {
      userId: '5421',
      reason: 'Multiple failed login attempts',
    },
  },
  {
    id: '2',
    timestamp: '15 mins ago',
    title: 'Refund Processed',
    description: '$125.50 refund processed to payment method',
    actor: 'finance-team',
    type: 'success',
    metadata: {
      orderId: 'ORD-12451',
      amount: 125.50,
    },
  },
  {
    id: '3',
    timestamp: '1 hour ago',
    title: 'Feature Flag Updated',
    description: 'Checkout v2 flag enabled for 10% of users',
    actor: 'product-admin',
    type: 'info',
    metadata: {
      flag: 'checkout_v2',
      rollout: '10%',
    },
  },
  {
    id: '4',
    timestamp: '3 hours ago',
    title: 'Provider Verified',
    description: 'Digital Services Clinic verified and activated',
    actor: 'compliance-team',
    type: 'success',
    metadata: {
      providerId: 'PRV-2341',
      verificationLevel: 'high',
    },
  },
]

export default function AuditPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
            <p className="text-muted-foreground mt-2">Immutable record of all administrative actions and system changes</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <Input placeholder="Search by actor, resource, or action..." className="flex-1" />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold mt-1">12,450</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold mt-1">99.8%</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={mockAuditEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
