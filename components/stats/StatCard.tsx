'use client'

import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'destructive'
  description?: string
}

const colorClasses = {
  primary: 'text-primary',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  destructive: 'text-red-600 dark:text-red-400',
}

const bgClasses = {
  primary: 'bg-primary/10',
  success: 'bg-green-100 dark:bg-green-900/20',
  warning: 'bg-amber-100 dark:bg-amber-900/20',
  destructive: 'bg-red-100 dark:bg-red-900/20',
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'primary',
  description,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={`p-2 rounded-lg ${bgClasses[color]}`}>
            <div className={colorClasses[color]}>{icon}</div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            <span
              className={
                change > 0
                  ? 'text-green-600 dark:text-green-400'
                  : change < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              }
            >
              {change > 0 && <ArrowUp className="h-3 w-3 inline" />}
              {change < 0 && <ArrowDown className="h-3 w-3 inline" />}
              {Math.abs(change)}%
            </span>
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
