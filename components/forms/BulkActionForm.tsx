'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { AlertBox } from '@/components/alerts/AlertBox'

interface BulkActionFormProps {
  title: string
  description?: string
  action: string
  requiresReason?: boolean
  selectedCount: number
  onConfirm: (reason?: string) => void
  onCancel: () => void
}

export function BulkActionForm({
  title,
  description,
  action,
  requiresReason,
  selectedCount,
  onConfirm,
  onCancel,
}: BulkActionFormProps) {
  const [reason, setReason] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (requiresReason && !reason.trim()) {
      alert('Reason is required for this action')
      return
    }
    setIsSubmitting(true)
    try {
      onConfirm(reason)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-amber-200 dark:border-amber-900/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <AlertBox
          title="Confirmation Required"
          message={`You are about to ${action} ${selectedCount} item(s). This action cannot be undone.`}
          type="warning"
          dismissible={false}
        />

        {requiresReason && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for action</label>
            <Textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24"
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(val) => setAgreed(Boolean(val))}
          />
          <label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer">
            I understand this action will affect {selectedCount} item(s) and cannot be reversed
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!agreed || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Confirm ${action}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
