'use client'

import { Clock } from 'lucide-react'

export interface TimelineEvent {
  id: string
  timestamp: string
  title: string
  description?: string
  actor?: string
  type: 'info' | 'success' | 'warning' | 'error'
  metadata?: Record<string, any>
}

interface TimelineProps {
  events: TimelineEvent[]
}

const typeColors = {
  info: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  success: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  error: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
}

const dotColors = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p>No events yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-4">
          {/* Timeline line and dot */}
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full ${dotColors[event.type]} ring-4 ring-background`} />
            {idx < events.length - 1 && (
              <div className="h-12 w-0.5 bg-border my-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-2">
            <div className={`p-4 rounded-lg border ${typeColors[event.type]}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{event.title}</p>
                  {event.actor && (
                    <p className="text-xs opacity-75">by {event.actor}</p>
                  )}
                </div>
                <span className="text-xs opacity-75 whitespace-nowrap">
                  {event.timestamp}
                </span>
              </div>
              {event.description && (
                <p className="text-sm mt-2">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
