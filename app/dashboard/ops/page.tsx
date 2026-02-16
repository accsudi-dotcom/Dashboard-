'use client'

import { ShoppingCart, Plus, Filter, Zap, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QueueItem } from '@/components/queues/QueueItem'
import { StatCard } from '@/components/stats/StatCard'

interface Order {
  id: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  provider: string
  customer: string
  amount: number
  createdAt: string
  slaRemaining?: number
}

const mockOrders: Order[] = [
  {
    id: 'ORD-12451',
    status: 'pending',
    provider: 'Digital Services Clinic',
    customer: 'Ahmed Hassan',
    amount: 450,
    createdAt: '3 mins ago',
    slaRemaining: 15,
  },
  {
    id: 'ORD-12450',
    status: 'in_progress',
    provider: 'Ahmed\'s Electronics',
    customer: 'Fatima Ali',
    amount: 1200,
    createdAt: '45 mins ago',
    slaRemaining: 45,
  },
  {
    id: 'ORD-12449',
    status: 'completed',
    provider: 'Digital Services Clinic',
    customer: 'Mohammed Ibrahim',
    amount: 750,
    createdAt: '2 hours ago',
  },
  {
    id: 'ORD-12448',
    status: 'accepted',
    provider: 'Premium Services',
    customer: 'Sarah Abdullah',
    amount: 350,
    createdAt: '1 hour ago',
    slaRemaining: 60,
  },
]

const statusColors = {
  pending: 'bg-red-600 hover:bg-red-700',
  accepted: 'bg-blue-600 hover:bg-blue-700',
  in_progress: 'bg-amber-600 hover:bg-amber-700',
  completed: 'bg-green-600 hover:bg-green-700',
  cancelled: 'bg-slate-600 hover:bg-slate-700',
}

const statusIcons = {
  pending: <AlertCircle className="h-4 w-4" />,
  accepted: <Clock className="h-4 w-4" />,
  in_progress: <Zap className="h-4 w-4 animate-pulse" />,
  completed: <TrendingUp className="h-4 w-4" />,
  cancelled: <AlertCircle className="h-4 w-4" />,
}

export default function OpsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Operations Workspace</h1>
            <p className="text-muted-foreground mt-2">Order queue, fulfillment tracking, and SLA management</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Bulk Action
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Pending Orders" value="145" change={8} description="vs yesterday" icon={<ShoppingCart className="h-5 w-5" />} color="destructive" />
          <StatCard title="In Progress" value="67" color="success" icon={<Zap className="h-5 w-5" />} />
          <StatCard title="SLA Breached" value="3" color="destructive" icon={<AlertCircle className="h-5 w-5" />} />
          <StatCard title="Completed Today" value="342" change={12} color="success" icon={<TrendingUp className="h-5 w-5" />} />
        </div>

        {/* Order Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Queue
              </CardTitle>
              <CardDescription>Manage orders and track fulfillment</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {statusIcons[order.status]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{order.id}</span>
                        <Badge className={statusColors[order.status]}>
                          {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{order.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1">Customer: {order.customer}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>SR {order.amount.toLocaleString()}</span>
                        <span>{order.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {order.slaRemaining && (
                      <Badge 
                        variant="outline"
                        className={order.slaRemaining < 30 ? 'border-red-500 text-red-700' : ''}
                      >
                        SLA: {order.slaRemaining}%
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      Actions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fulfillment Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fulfillment Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Fulfillment Time</span>
                  <span className="text-sm font-medium">4.2 hours</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order Acceptance Rate</span>
                  <span className="text-sm font-medium">95.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                Bulk Accept Orders
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Resolve SLA Breaches
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Reassign Orders
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Generate Daily Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
