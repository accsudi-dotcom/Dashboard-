'use client'

import React from 'react'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  icon: React.ReactNode
}

function MetricCard({ title, value, change, trend, icon }: MetricProps) {
  const isPositive = trend === 'up'
  return (
    <Card className="border-slate-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="text-slate-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className={`flex items-center gap-1 text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}% vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsGrid() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$48,320.50',
      change: 12,
      trend: 'up' as const,
      icon: '💰',
    },
    {
      title: 'Active Users',
      value: '2,543',
      change: 8,
      trend: 'up' as const,
      icon: '👥',
    },
    {
      title: 'Orders',
      value: '1,203',
      change: -3,
      trend: 'down' as const,
      icon: '📦',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: 2,
      trend: 'up' as const,
      icon: '📈',
    },
    {
      title: 'Avg Order Value',
      value: '$156.32',
      change: 5,
      trend: 'up' as const,
      icon: '💵',
    },
    {
      title: 'Security Events',
      value: '12',
      change: -15,
      trend: 'down' as const,
      icon: '🔐',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}
