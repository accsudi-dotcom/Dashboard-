'use client'

import { useQuery } from '@tanstack/react-query'
import { Ticket, Plus, Filter, Clock, AlertCircle, CheckCircle2, MessageSquare, UserCheck, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QueueItem } from '@/components/queues/QueueItem'
import { StatCard } from '@/components/stats/StatCard'
import { useState } from 'react'

interface SupportTicket {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'waiting' | 'resolved'
  time: string
  assignee?: string
  slaRemaining?: number
  customerId: string
}

const priorityColors = {
  critical: 'bg-red-600 hover:bg-red-700',
  high: 'bg-orange-600 hover:bg-orange-700',
  medium: 'bg-amber-600 hover:bg-amber-700',
  low: 'bg-blue-600 hover:bg-blue-700',
}

const statusIcons = {
  open: <AlertCircle className="h-4 w-4 text-red-500" />,
  in_progress: <Clock className="h-4 w-4 animate-spin text-amber-500" />,
  waiting: <MessageSquare className="h-4 w-4 text-blue-500" />,
  resolved: <CheckCircle2 className="h-4 w-4 text-green-500" />,
}

export default function SupportPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const { data: ticketsResponse, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch('/api/dev/tickets')
      if (!res.ok) throw new Error('Failed to fetch tickets')
      return res.json()
    },
  })

  const mockTickets = (ticketsResponse?.data || []) as SupportTicket[]

  const stats = [
    { label: 'Open Tickets', value: '23', change: 5, icon: <AlertCircle className="h-5 w-5" />, color: 'destructive' },
    { label: 'Avg Response', value: '8 min', icon: <Clock className="h-5 w-5" />, color: 'success' },
    { label: 'SLA Compliance', value: '94.5%', icon: <TrendingUp className="h-5 w-5" />, color: 'success' },
    { label: 'Resolved Today', value: '12', change: 3, icon: <CheckCircle2 className="h-5 w-5" />, color: 'success' },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Workspace</h1>
            <p className="text-muted-foreground mt-2">Manage customer support tickets and resolve issues with SLA tracking</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatCard 
              key={idx}
              title={stat.label} 
              value={stat.value} 
              change={stat.change}
              description={stat.change ? 'vs yesterday' : undefined}
              icon={stat.icon}
              color={stat.color as any}
            />
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'open', 'in_progress', 'waiting'].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.replace('_', ' ').charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        {/* Active Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Support Tickets Queue
              </CardTitle>
              <CardDescription>Active tickets requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {statusIcons[ticket.status]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{ticket.id}</span>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                        {ticket.assignee && (
                          <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                            <UserCheck className="h-3 w-3" />
                            {ticket.assignee}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ticket.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{ticket.customerId}</span>
                        <span>{ticket.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {ticket.slaRemaining && (
                      <Badge 
                        variant="outline"
                        className={ticket.slaRemaining < 30 ? 'border-red-500 text-red-700' : ''}
                      >
                        SLA: {ticket.slaRemaining}%
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      Respond
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                  <span className="text-sm font-medium">2.5 hours</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ticket Resolution Rate</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 w-5/6 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
