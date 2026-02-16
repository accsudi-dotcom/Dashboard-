'use client'

import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AlertBoxProps {
  title: string
  message: string
  type?: 'error' | 'warning' | 'info' | 'success'
  dismissible?: boolean
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    textClass: 'text-red-900 dark:text-red-200',
    titleClass: 'text-red-900 dark:text-red-100 font-semibold',
    iconClass: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bgClass:
      'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-900 dark:text-amber-200',
    titleClass: 'text-amber-900 dark:text-amber-100 font-semibold',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    bgClass:
      'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    textClass: 'text-blue-900 dark:text-blue-200',
    titleClass: 'text-blue-900 dark:text-blue-100 font-semibold',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    icon: CheckCircle2,
    bgClass:
      'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    textClass: 'text-green-900 dark:text-green-200',
    titleClass: 'text-green-900 dark:text-green-100 font-semibold',
    iconClass: 'text-green-600 dark:text-green-400',
  },
}

export function AlertBox({
  title,
  message,
  type = 'info',
  dismissible = true,
  actions,
}: AlertBoxProps) {
  const [isOpen, setIsOpen] = useState(true)
  const config = typeConfig[type]
  const Icon = config.icon

  if (!isOpen) return null

  return (
    <div className={`rounded-lg border p-4 ${config.bgClass}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
        <div className="flex-1 min-w-0">
          <h3 className={config.titleClass}>{title}</h3>
          <p className={`text-sm mt-1 ${config.textClass}`}>{message}</p>
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            onClick={() => setIsOpen(false)}
            className={`flex-shrink-0 p-1 rounded hover:opacity-75 transition-opacity ${config.iconClass}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
