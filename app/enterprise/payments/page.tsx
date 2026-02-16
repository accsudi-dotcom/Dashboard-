'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Search, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const payments = [
    {
      id: 'PAY-001',
      transactionId: 'txn_abc123def456',
      amount: 5000,
      currency: 'AED',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-06-10',
    },
    {
      id: 'PAY-002',
      transactionId: 'txn_xyz789uvw012',
      amount: 3200,
      currency: 'AED',
      status: 'completed',
      method: 'Bank Transfer',
      date: '2024-06-09',
    },
    {
      id: 'PAY-003',
      transactionId: 'txn_mno345pqr678',
      amount: 1500,
      currency: 'AED',
      status: 'pending',
      method: 'Credit Card',
      date: '2024-06-08',
    },
    {
      id: 'PAY-004',
      transactionId: 'txn_stu901vwx234',
      amount: 2000,
      currency: 'AED',
      status: 'failed',
      method: 'Bank Transfer',
      date: '2024-06-07',
    },
  ]

  const chartData = [
    { date: 'Jun 1', revenue: 250000, transactions: 125 },
    { date: 'Jun 2', revenue: 280000, transactions: 140 },
    { date: 'Jun 3', revenue: 320000, transactions: 160 },
    { date: 'Jun 4', revenue: 300000, transactions: 150 },
    { date: 'Jun 5', revenue: 350000, transactions: 175 },
    { date: 'Jun 6', revenue: 380000, transactions: 190 },
  ]

  const statusColor = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  const stats = [
    { label: 'Total Revenue', value: '2,050,000 AED', icon: <DollarSign className="h-6 w-6" />, color: 'text-green-600' },
    { label: 'Completed', value: '1,956 txns', icon: <TrendingUp className="h-6 w-6" />, color: 'text-blue-600' },
    { label: 'Pending', value: '45 txns', icon: <AlertCircle className="h-6 w-6" />, color: 'text-yellow-600' },
    { label: 'Failed', value: '12 txns', icon: <AlertCircle className="h-6 w-6" />, color: 'text-red-600' },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Transactions</h1>
          <p className="text-muted-foreground mt-2">Monitor all payment activity and revenue</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 6 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${(Number(value) / 1000).toFixed(0)}K AED`} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>Number of transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                  <TableCell className="font-bold">{payment.amount.toLocaleString()} {payment.currency}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge className={statusColor[payment.status as keyof typeof statusColor]}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{payment.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
