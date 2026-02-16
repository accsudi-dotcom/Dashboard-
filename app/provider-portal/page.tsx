'use client'

import { TrendingUp, Package, DollarSign, Star, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const providerStats = [
  { label: 'Total Orders', value: '342', change: 12, color: 'success' },
  { label: 'Completed', value: '298', change: 8, color: 'success' },
  { label: 'Pending', value: '34', change: -5, color: 'warning' },
  { label: 'Rating', value: '4.8/5.0', change: 2, color: 'success' },
]

const recentOrders = [
  { id: 'ORD-1001', customer: 'Ahmed Hassan', amount: 450, status: 'completed', date: '2 hours ago' },
  { id: 'ORD-1002', customer: 'Fatima Ali', amount: 750, status: 'in_progress', date: '30 mins ago' },
  { id: 'ORD-1003', customer: 'Mohammed Ibrahim', amount: 320, status: 'pending', date: '5 mins ago' },
]

export default function ProviderPortalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Provider Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your orders and business performance</p>
          </div>
          <Button>View Profile</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {providerStats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.color === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}% this month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders and their status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="border border-border/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">SR {order.amount}</span>
                  <Badge className={order.status === 'completed' ? 'bg-green-600' : order.status === 'in_progress' ? 'bg-blue-600' : 'bg-yellow-600'}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{order.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
