/**
 * Analytics Engine
 * Aggregates metrics and events for real-time insights and reporting
 */
export interface Event {
  id: string
  name: string
  timestamp: Date
  userId?: string
  tenantId: string
  properties?: Record<string, any>
}

export interface Metric {
  name: string
  value: number
  unit?: string
  timestamp: Date
  tags?: Record<string, string>
}

export interface AggregatedMetric {
  name: string
  count: number
  sum: number
  average: number
  min: number
  max: number
  lastValue: number
}

export interface ChartDataPoint {
  timestamp: Date
  value: number
  label?: string
}

export class AnalyticsEngine {
  private events: Event[] = []
  private metrics: Metric[] = []

  recordEvent(event: Omit<Event, 'id'>): void {
    this.events.push({
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    })
  }

  recordMetric(metric: Metric): void {
    this.metrics.push(metric)
  }

  getEventsByName(name: string, tenantId: string): Event[] {
    return this.events.filter((e) => e.name === name && e.tenantId === tenantId)
  }

  getEventsByDateRange(tenantId: string, startDate: Date, endDate: Date): Event[] {
    return this.events.filter((e) => e.tenantId === tenantId && e.timestamp >= startDate && e.timestamp <= endDate)
  }

  countEventsByName(name: string, tenantId: string): number {
    return this.getEventsByName(name, tenantId).length
  }

  countEventsByNameInRange(name: string, tenantId: string, startDate: Date, endDate: Date): number {
    return this.events.filter(
      (e) =>
        e.name === name &&
        e.tenantId === tenantId &&
        e.timestamp >= startDate &&
        e.timestamp <= endDate
    ).length
  }

  getMetricsForPeriod(
    metricName: string,
    startDate: Date,
    endDate: Date,
    tags?: Record<string, string>
  ): Metric[] {
    return this.metrics.filter((m) => {
      if (m.name !== metricName) return false
      if (m.timestamp < startDate || m.timestamp > endDate) return false
      if (tags) {
        return Object.entries(tags).every(([key, value]) => m.tags?.[key] === value)
      }
      return true
    })
  }

  aggregateMetrics(metricName: string, startDate: Date, endDate: Date): AggregatedMetric | null {
    const metrics = this.getMetricsForPeriod(metricName, startDate, endDate)
    if (metrics.length === 0) return null

    const values = metrics.map((m) => m.value)
    return {
      name: metricName,
      count: metrics.length,
      sum: values.reduce((a, b) => a + b, 0),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      lastValue: metrics[metrics.length - 1].value,
    }
  }

  getChartData(
    metricName: string,
    startDate: Date,
    endDate: Date,
    bucketIntervalMs: number = 3600000 // 1 hour
  ): ChartDataPoint[] {
    const metrics = this.getMetricsForPeriod(metricName, startDate, endDate)
    const buckets = new Map<number, number[]>()

    // Group metrics into time buckets
    for (const metric of metrics) {
      const bucketTime = Math.floor(metric.timestamp.getTime() / bucketIntervalMs) * bucketIntervalMs
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, [])
      }
      buckets.get(bucketTime)!.push(metric.value)
    }

    // Aggregate bucket data
    const data: ChartDataPoint[] = []
    for (const [bucketTime, values] of buckets) {
      data.push({
        timestamp: new Date(bucketTime),
        value: values.reduce((a, b) => a + b, 0) / values.length, // Average
      })
    }

    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  getChangeOverTime(
    metricName: string,
    previousStart: Date,
    previousEnd: Date,
    currentStart: Date,
    currentEnd: Date
  ): { previousValue: number; currentValue: number; changePercent: number } {
    const previousMetrics = this.getMetricsForPeriod(metricName, previousStart, previousEnd)
    const currentMetrics = this.getMetricsForPeriod(metricName, currentStart, currentEnd)

    const previousValue =
      previousMetrics.length > 0
        ? previousMetrics.reduce((a, b) => a + b.value, 0) / previousMetrics.length
        : 0
    const currentValue =
      currentMetrics.length > 0
        ? currentMetrics.reduce((a, b) => a + b.value, 0) / currentMetrics.length
        : 0

    const changePercent = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

    return {
      previousValue,
      currentValue,
      changePercent,
    }
  }

  clear(): void {
    this.events = []
    this.metrics = []
  }
}

export const analyticsEngine = new AnalyticsEngine()
