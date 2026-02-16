'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ShoppingCart, Search, Filter, Download, Plus, Clock, CheckCircle, XCircle, AlertCircle, Truck, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stats/StatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/dev/orders')
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    },
  })

  const mockOrders = ordersResponse?.data || []

  const filteredOrders = mockOrders.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockOrders.length,
    completed: mockOrders.filter(o => o.status === 'completed').length,
    processing: mockOrders.filter(o => o.status === 'processing' || o.status === 'pending').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
    revenue: mockOrders.reduce((sum, o) => sum + o.amount, 0),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-muted-foreground mt-2">Track, manage, and analyze all customer orders in real-time</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard 
            title="Total Orders" 
            value={stats.total} 
            change={12} 
            description="vs last week" 
            icon={<ShoppingCart className="h-5 w-5" />} 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            color="success" 
            icon={<CheckCircle className="h-5 w-5" />} 
          />
          <StatCard 
            title="Processing" 
            value={stats.processing} 
            color="warning" 
            icon={<Clock className="h-5 w-5" />} 
          />
          <StatCard 
            title="Cancelled" 
            value={stats.cancelled} 
            color="destructive" 
            icon={<XCircle className="h-5 w-5" />} 
          />
          <StatCard 
            title="Revenue" 
            value={`$${stats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} 
            color="success" 
            icon={<ShoppingCart className="h-5 w-5" />} 
          />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Search by order ID or customer..." 
              className="flex-1" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline"><Search className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Recent</SelectItem>
                <SelectItem value="amount-high">Amount (High)</SelectItem>
                <SelectItem value="amount-low">Amount (Low)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({filteredOrders.length})</TabsTrigger>
            <TabsTrigger value="active">Processing ({mockOrders.filter(o => o.status === 'processing' || o.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="recent">Recent 7 days</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left font-medium">Customer</th>
                        <th className="px-6 py-3 text-left font-medium">Amount</th>
                        <th className="px-6 py-3 text-left font-medium">Items</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium">Payment</th>
                        <th className="px-6 py-3 text-left font-medium">Shipping</th>
                        <th className="px-6 py-3 text-left font-medium">Date</th>
                        <th className="px-6 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">No orders found</td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-semibold">{order.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{order.customer}</p>
                                <p className="text-xs text-muted-foreground">{order.provider}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold">${order.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{order.items} items</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={
                                order.status === 'completed' ? 'default' :
                                order.status === 'processing' || order.status === 'pending' ? 'secondary' :
                                'destructive'
                              } className="flex items-center gap-1 w-fit">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={order.payment === 'completed' ? 'default' : 'secondary'}>
                                {order.payment}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <Truck className="h-3 w-3" />
                                {order.shipping}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-xs">{order.date}</td>
                            <td className="px-6 py-4 text-right">
                              <Button size="sm" variant="ghost">View</Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Active orders filtered view</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Recent 7 days orders view</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
