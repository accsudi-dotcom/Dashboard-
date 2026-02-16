'use client'

import { CreditCard, Plus, Filter, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QueueItem } from '@/components/queues/QueueItem'
import { StatCard } from '@/components/stats/StatCard'

const mockTransactions = [
  {
    id: 'TXN-56741',
    title: 'Refund Request - ORD-12451',
    description: 'Customer initiated refund',
    priority: 'high' as const,
    status: 'pending' as const,
    time: '12 mins ago',
  },
  {
    id: 'TXN-56740',
    title: 'Escrow Release - ORD-12450',
    description: 'Ready for payout processing',
    priority: 'medium' as const,
    status: 'processing' as const,
    time: '1 hour ago',
    assignee: 'Finance',
  },
]

export default function FinancePage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance Workspace</h1>
            <p className="text-muted-foreground mt-2">Payments, refunds, escrow, and financial reports</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value="$542K" change={18} description="vs last month" icon={<CreditCard className="h-5 w-5" />} color="success" />
          <StatCard title="Pending Refunds" value="$24.5K" change={-5} color="warning" icon={<CreditCard className="h-5 w-5" />} />
          <StatCard title="Escrow Balance" value="$156K" color="success" icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard title="Transaction Fee" value="2.5%" color="primary" icon={<CreditCard className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pending Transactions
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTransactions.map((txn) => (
              <QueueItem
                key={txn.id}
                {...txn}
                actions={[
                  { label: 'Review', onClick: () => {} },
                  { label: 'Approve', onClick: () => {} },
                ]}
              />
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">99.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '99%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                  <span className="text-sm font-medium">1.2s</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full bg-blue-600 w-1/3 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">Process Bulk Payouts</Button>
              <Button className="w-full justify-start" variant="outline">Generate Financial Report</Button>
              <Button className="w-full justify-start" variant="outline">Settle Escrow</Button>
              <Button className="w-full justify-start" variant="outline">View Audit Trail</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
