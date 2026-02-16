"use client"

import { useEffect, useState } from 'react'
import { ArrowUpRight, AlertCircle, TrendingUp, Users, ShoppingCart, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
}

function KPICard({ title, value, change, icon: Icon, trend = 'neutral' }: KPICardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className={`h-4 w-4 ${
                  trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'
                }`} />
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-slate-600 dark:text-slate-400'
                }`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <Icon className="h-5 w-5 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AlertItem {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
}

function AlertBadge({ severity }: { severity: string }) {
  if (severity === 'critical')
    return <Badge className="bg-red-600 hover:bg-red-700">Critical</Badge>
  if (severity === 'warning')
    return <Badge className="bg-amber-600 hover:bg-amber-700">Warning</Badge>
  return <Badge className="bg-blue-600 hover:bg-blue-700">Info</Badge>
}

/**
 * Command Center Page
 * Real-time operational dashboard with KPIs, alerts, and live queues
 */
export default function CommandCenterPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [metrics, setMetrics] = useState<Array<{ date: string; value: number; target?: number }>>([])
  const [queueData, setQueueData] = useState<Array<{ name: string; count: number; sla: string; color: string }>>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [metricsRes, securityRes, ordersRes, ticketsRes] = await Promise.all([
          fetch('/api/dev/mock?type=metrics').then((r) => r.json()),
          fetch('/api/dev/mock?type=security').then((r) => r.json()),
          fetch('/api/dev/mock?type=orders').then((r) => r.json()),
          fetch('/api/dev/mock?type=tickets').then((r) => r.json()),
        ])

        if (!mounted) return

        // metrics endpoint returns { data: [...] } or array
        const metricsData = Array.isArray(metricsRes) ? metricsRes : metricsRes.data || metricsRes
        setMetrics(metricsData)

        const securityData = securityRes?.data || []
        const ordersData = ordersRes?.data || []
        const ticketsData = ticketsRes?.data || []

        // derive alerts from security events and tickets
        const derivedAlerts: AlertItem[] = [...securityData, ...ticketsData].slice(0, 6).map((it: any, idx: number) => ({
          id: it.id || `a-${idx}`,
          severity: it.type === 'failed_otp' ? 'critical' : it.priority ? (it.priority === 'high' ? 'warning' : 'info') : 'info',
          title: it.subject || it.action || 'System Event',
          description: it.description || it.reason || `${it.type || 'event'} detected`,
          timestamp: it.createdAt || new Date().toISOString(),
        }))

        setAlerts(derivedAlerts)

        // queues derived from orders/tickets
        const pendingOrders = ordersData.filter((o: any) => o.status === 'processing' || o.status === 'pending').length
        const inProgressTickets = ticketsData.filter((t: any) => t.status === 'in_progress' || t.status === 'open').length

        setQueueData([
          { name: 'Pending Orders', count: pendingOrders || 145, sla: '60%', color: 'bg-amber-500' },
          { name: 'Disputes (24h)', count: Math.round((ordersData.length || 0) * 0.05) || 23, sla: '78%', color: 'bg-orange-500' },
          { name: 'SLA Breached', count: Math.round((ordersData.length || 0) * 0.01) || 8, sla: '10%', color: 'bg-red-500' },
          { name: 'Tickets Open', count: inProgressTickets || 67, sla: '85%', color: 'bg-blue-500' },
        ])
      } catch (err) {
        // fallback to defaults already present in markup
        console.warn('Failed to load mock data', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2">Real-time operational overview and alerts</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Gross Merchandise Value"
            value="$2.4M"
            change="+12.5%"
            trend="up"
            icon={DollarSign}
          />
          <KPICard
            title="Active Users"
            value="15,234"
            change="+8.2%"
            trend="up"
            icon={Users}
          />
          <KPICard
            title="Pending Refunds"
            value="$124.5K"
            change="-3.2%"
            trend="down"
            icon={ArrowUpRight}
          />
          <KPICard
            title="High-Risk Events"
            value="24"
            change="+2"
            trend="up"
            icon={AlertCircle}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Active Alerts & Incidents
                </CardTitle>
                <CardDescription>Critical events requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertBadge severity={alert.severity} />
                          <h3 className="font-semibold text-sm">{alert.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Queues */}
          <div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-accent" />
                  Live Queues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {queueData.map((queue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border/50 bg-card/50 cursor-pointer hover:bg-card transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{queue.name}</p>
                      <Badge variant="secondary">{queue.count}</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${queue.color}`}
                        style={{ width: queue.sla }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{queue.sla} SLA</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Latency</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    42ms
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 w-1/3 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Success Rate</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    99.2%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '99%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Uptime</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    99.98%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '99.98%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Bulk Approve Orders
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Resolve SLA Breaches
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Review High-Risk Events
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Daily Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
