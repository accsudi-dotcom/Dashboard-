'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react'

type StatusType =
  | 'success'
  | 'pending'
  | 'processing'
  | 'warning'
  | 'error'
  | 'idle'
  | 'loading'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  showIcon?: boolean
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    variant: 'default' as const,
    className: 'bg-emerald-600 hover:bg-emerald-700',
  },
  pending: {
    icon: Clock,
    variant: 'secondary' as const,
    className: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
  },
  processing: {
    icon: Loader2,
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 animate-pulse',
  },
  warning: {
    icon: AlertCircle,
    variant: 'secondary' as const,
    className: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
  },
  error: {
    icon: XCircle,
    variant: 'destructive' as const,
    className: 'bg-red-600 hover:bg-red-700',
  },
  idle: {
    icon: XCircle,
    variant: 'secondary' as const,
    className: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
  },
  loading: {
    icon: Loader2,
    variant: 'secondary' as const,
    className: 'animate-spin',
  },
}

export function StatusBadge({ status, label, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {displayLabel}
    </Badge>
  )
}
