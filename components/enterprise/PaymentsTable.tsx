'use client'

import React, { useState } from 'react'
import { MoreVertical, Undo2, Check, Clock } from 'lucide-react'
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
import { RefundModal } from './RefundModal'

const mockPayments = [
  {
    id: 'PAY-001',
    orderId: 'ORD-001',
    method: 'Credit Card',
    amount: '$2,450.00',
    status: 'completed',
    date: '2024-02-14',
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-002',
    method: 'Bank Transfer',
    amount: '$1,890.50',
    status: 'pending',
    date: '2024-02-13',
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-003',
    method: 'Apple Pay',
    amount: '$3,210.00',
    status: 'completed',
    date: '2024-02-12',
  },
]

export function PaymentsTable() {
  const [payments, setPayments] = useState(mockPayments)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)

  const handleRefund = (payment: any) => {
    if (payment.status !== 'completed') return
    setSelectedPayment(payment)
    setShowRefundModal(true)
  }

  const handleRefundSubmit = (reason: string) => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id
            ? { ...p, status: 'refunded', refundReason: reason }
            : p
        )
      )
      setShowRefundModal(false)
      setSelectedPayment(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Payments</CardTitle>
          <Button>New Payment</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead>Payment ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell className="font-medium">{payment.orderId}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="font-semibold">{payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)} variant="outline">
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{payment.date}</TableCell>
                  <TableCell>
                    {payment.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRefund(payment)}
                      >
                        <Undo2 className="w-4 h-4 text-orange-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPayment && (
        <RefundModal
          payment={selectedPayment}
          open={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          onSubmit={handleRefundSubmit}
        />
      )}
    </>
  )
}
