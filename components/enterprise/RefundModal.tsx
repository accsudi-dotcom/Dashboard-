'use client'

import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface RefundModalProps {
  payment: any
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export function RefundModal({ payment, open, onClose, onSubmit }: RefundModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for the refund')
      return
    }
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      onSubmit(reason)
      setReason('')
      setLoading(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Payment</DialogTitle>
        </DialogHeader>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-700" />
          <AlertDescription className="text-yellow-700">
            This action is irreversible. Please provide a clear reason.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600">Payment Details</p>
            <div className="mt-2 p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Payment ID:</span>
                <span className="font-mono font-semibold">{payment.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Amount:</span>
                <span className="font-semibold">{payment.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Order:</span>
                <span className="font-semibold">{payment.orderId}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason" className="font-semibold">
              Reason for Refund *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this payment is being refunded..."
              className="mt-2 min-h-32"
            />
            <p className="text-xs text-slate-500 mt-1">
              {reason.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            variant="destructive"
          >
            {loading ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
