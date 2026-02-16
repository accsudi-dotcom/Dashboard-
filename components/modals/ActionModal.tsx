'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface ActionModalProps {
  open: boolean
  title: string
  description?: string
  placeholder?: string
  requireReason?: boolean
  onConfirm: (reason?: string) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isDangerous?: boolean
}

export function ActionModal({
  open,
  title,
  description,
  placeholder = 'Enter reason for this action...',
  requireReason = false,
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: ActionModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) {
      alert('Please provide a reason for this action')
      return
    }

    setSubmitting(true)
    try {
      await onConfirm(reason)
      setReason('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {requireReason && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Reason for this action</label>
            <Textarea
              placeholder={placeholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              disabled={submitting || isLoading}
            />
          </div>
        )}

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={submitting || isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant={isDangerous ? 'destructive' : 'default'}
            disabled={submitting || isLoading}
          >
            {submitting || isLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
