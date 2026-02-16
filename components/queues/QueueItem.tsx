'use client'

import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QueueItemProps {
  id: string
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'pending' | 'processing' | 'resolved'
  time?: string
  assignee?: string
  onSelect?: (id: string) => void
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

const priorityConfig = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  critical:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
  },
  processing: {
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
  },
  resolved: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
  },
}

export function QueueItem({
  id,
  title,
  description,
  priority,
  status = 'pending',
  time,
  assignee,
  onSelect,
  actions,
}: QueueItemProps) {
  const statusIcon = statusConfig[status]
  const StatusIcon = statusIcon.icon

  return (
    <div
      onClick={() => onSelect?.(id)}
      className="p-4 border border-border rounded-lg hover:shadow-md hover:border-accent transition-all cursor-pointer group bg-card hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate group-hover:text-accent transition-colors">
              {title}
            </h4>
            {priority && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityConfig[priority]}`}>
                {priority}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <StatusIcon className={`h-3 w-3 ${statusIcon.color}`} />
              <span className="capitalize">{status}</span>
            </div>
            {time && <span>{time}</span>}
            {assignee && <span>Assigned to {assignee}</span>}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2 flex-shrink-0">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
