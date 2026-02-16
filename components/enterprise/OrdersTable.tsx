'use client'

import React, { useState } from 'react'
import { Eye, MoreVertical, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderDetailPanel } from './OrderDetailPanel'

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: '$2,450.00',
    status: 'completed',
    date: '2024-02-14',
    items: 5,
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: '$1,890.50',
    status: 'pending',
    date: '2024-02-13',
    items: 3,
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    amount: '$3,210.00',
    status: 'shipped',
    date: '2024-02-12',
    items: 8,
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    amount: '$945.25',
    status: 'cancelled',
    date: '2024-02-11',
    items: 2,
  },
]

export function OrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orders, setOrders] = useState(mockOrders)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Orders</CardTitle>
          <Button>New Order</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-semibold">{order.amount}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{order.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setOrders(orders.filter((o) => o.id !== order.id))}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}
