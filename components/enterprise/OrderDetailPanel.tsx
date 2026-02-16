'use client'

import React from 'react'
import { X, Package, DollarSign, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderDetailPanelProps {
  order: any
  onClose: () => void
}

export function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-slate-200 shadow-lg z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Order ID & Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600">ORDER INFO</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Order ID</span>
              <span className="font-mono font-semibold">{order.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Status</span>
              <Badge variant="outline">{order.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Date</span>
              <span className="text-sm">{order.date}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600">CUSTOMER</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>{order.customer}</span>
            </div>
            <div className="text-sm text-slate-600">customer@email.com</div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600">ITEMS ({order.items})</h3>
          <div className="space-y-2">
            {[...Array(Math.min(3, order.items))].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">Product {i + 1}</span>
                </div>
                <span className="text-sm font-semibold">$${(i + 1) * 100}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-slate-600">AMOUNT</h3>
          <div className="flex items-center justify-between">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">{order.amount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button className="w-full" variant="outline">
            Edit Order
          </Button>
          <Button className="w-full text-red-600 hover:text-red-600" variant="outline">
            Cancel Order
          </Button>
        </div>
      </div>
    </div>
  )
}
