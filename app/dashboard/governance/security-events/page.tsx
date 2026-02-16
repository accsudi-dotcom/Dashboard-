'use client'

import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline, TimelineEvent } from '@/components/timeline/Timeline'

const mockSecurityEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: '5 mins ago',
    title: 'Failed OTP Attempt (x5)',
    description: 'User #5421 attempted login with wrong OTP 5 times from IP 192.168.1.1',
    actor: 'system',
    type: 'error',
  },
  {
    id: '2',
    timestamp: '18 mins ago',
    title: 'New Device Pairing',
    description: 'Device pairing from unknown location: Cairo, Egypt',
    actor: 'system',
    type: 'warning',
  },
  {
    id: '3',
    timestamp: '1 hour ago',
    title: 'Account Integrity Check Passed',
    description: 'Regular security audit completed successfully',
    actor: 'system',
    type: 'success',
  },
]

export default function SecurityEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Events</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage security incidents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Event Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline events={mockSecurityEvents} />
        </CardContent>
      </Card>
    </div>
  )
}
