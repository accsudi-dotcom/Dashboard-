'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CreditCard, Search, Download, Plus, Filter, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle, RefreshCw } from 'lucide-react'
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

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const { data: paymentsResponse, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await fetch('/api/dev/payments')
      if (!res.ok) throw new Error('Failed to fetch payments')
      return res.json()
    },
  })

  const mockPayments = paymentsResponse?.data || []

  const filteredPayments = (mockPayments as any[]).filter((payment: any) => {
    const matchesSearch = payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const stats = {
    totalRevenue: (mockPayments as any[]).reduce((sum: number, p: any) => sum + (p.status !== 'refunded' ? p.amount || 0 : 0), 0),
    completed: (mockPayments as any[]).filter((p: any) => p.status === 'completed').length,
    inEscrow: (mockPayments as any[]).reduce((sum: number, p: any) => p.status === 'in_escrow' ? sum + (p.amount || 0) : sum, 0),
    refunded: (mockPayments as any[]).reduce((sum: number, p: any) => p.status === 'refunded' ? sum + (p.refundAmount || 0) : sum, 0),
    avgFee: ((mockPayments as any[]).reduce((sum: number, p: any) => sum + (p.fee || 0), 0) / (mockPayments as any[]).length).toFixed(2),
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
            <p className="text-muted-foreground mt-2">Monitor transactions, manage refunds, and reconcile payments</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Payment
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
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
            change={18} 
            description="vs last month" 
            icon={<DollarSign className="h-5 w-5" />} 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed.toString()} 
            color="success" 
            icon={<CheckCircle className="h-5 w-5" />} 
          />
          <StatCard 
            title="In Escrow" 
            value={`$${stats.inEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
            color="warning" 
            icon={<Clock className="h-5 w-5" />} 
          />
          <StatCard 
            title="Refunded" 
            value={`$${stats.refunded.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
            color="destructive" 
            icon={<RefreshCw className="h-5 w-5" />} 
          />
          <StatCard 
            title="Avg Fee" 
            value={`$${stats.avgFee}`} 
            icon={<TrendingUp className="h-5 w-5" />} 
          />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Search by payment ID, customer, or order..." 
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_escrow">In Escrow</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({filteredPayments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({(mockPayments as any[]).filter((p: any) => p.status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({(mockPayments as any[]).filter((p: any) => p.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="escrow">In Escrow ({(mockPayments as any[]).filter((p: any) => p.status === 'in_escrow').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Payment ID</th>
                        <th className="px-6 py-3 text-left font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left font-medium">Customer</th>
                        <th className="px-6 py-3 text-left font-medium">Amount</th>
                        <th className="px-6 py-3 text-left font-medium">Method</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium">Date</th>
                        <th className="px-6 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No payments found</td>
                        </tr>
                      ) : (
                        filteredPayments.map((payment: any) => (
                          <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-semibold">{payment.id}</span>
                            </td>
                            <td className="px-6 py-4">{payment.orderId}</td>
                            <td className="px-6 py-4">{payment.customer}</td>
                            <td className="px-6 py-4 font-semibold">${(payment.amount || 0).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{payment.method}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={
                                payment.status === 'completed' ? 'default' :
                                payment.status === 'pending' ? 'secondary' :
                                payment.status === 'in_escrow' ? 'secondary' :
                                'destructive'
                              }>
                                {payment.status?.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-xs">{payment.date}</td>
                            <td className="px-6 py-4 text-right">
                              {payment.status === 'completed' && (
                                <Button size="sm" variant="ghost">Refund</Button>
                              )}
                              {payment.status !== 'completed' && (
                                <Button size="sm" variant="ghost">View</Button>
                              )}
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

          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Completed payments view</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Pending payments view</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">Payments in escrow view</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
