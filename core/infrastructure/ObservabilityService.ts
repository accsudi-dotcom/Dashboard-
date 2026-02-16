/**
 * Observability Service
 * Handles logging, metrics, tracing, and alerting
 * Extensible for integration with ELK, Datadog, New Relic, etc.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  correlationId?: string
  context?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

export interface Metric {
  name: string
  value: number
  timestamp: Date
  tags?: Record<string, string>
}

export interface TraceSpan {
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  startTime: Date
  endTime?: Date
  duration?: number
  status: 'active' | 'success' | 'error'
  attributes?: Record<string, any>
  error?: Error
}

export class ObservabilityService {
  private logs: LogEntry[] = []
  private metrics: Metric[] = []
  private traces: Map<string, TraceSpan[]> = new Map()
  private minLogLevel: LogLevel = 'debug'

  setMinLogLevel(level: LogLevel): void {
    this.minLogLevel = level
  }

  log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    correlationId?: string,
    error?: Error
  ): void {
    const logLevels = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 }
    if (logLevels[level] < logLevels[this.minLogLevel]) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      correlationId,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }

    this.logs.push(entry)

    // In production: send to external service
    if (level === 'error' || level === 'fatal') {
      console.error(`[${level.toUpperCase()}] ${message}`, context)
    }
  }

  debug(message: string, context?: Record<string, any>, correlationId?: string): void {
    this.log('debug', message, context, correlationId)
  }

  info(message: string, context?: Record<string, any>, correlationId?: string): void {
    this.log('info', message, context, correlationId)
  }

  warn(message: string, context?: Record<string, any>, correlationId?: string): void {
    this.log('warn', message, context, correlationId)
  }

  error(message: string, error?: Error, context?: Record<string, any>, correlationId?: string): void {
    this.log('error', message, context, correlationId, error)
  }

  fatal(message: string, error?: Error, context?: Record<string, any>, correlationId?: string): void {
    this.log('fatal', message, context, correlationId, error)
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      timestamp: new Date(),
      tags,
    })
  }

  startSpan(traceId: string, spanId: string, name: string, parentSpanId?: string): TraceSpan {
    const span: TraceSpan = {
      traceId,
      spanId,
      parentSpanId,
      name,
      startTime: new Date(),
      status: 'active',
    }

    if (!this.traces.has(traceId)) {
      this.traces.set(traceId, [])
    }
    this.traces.get(traceId)!.push(span)

    return span
  }

  endSpan(traceId: string, spanId: string, status: 'success' | 'error' = 'success', error?: Error): void {
    const spans = this.traces.get(traceId)
    if (!spans) return

    const span = spans.find((s) => s.spanId === spanId)
    if (span) {
      span.endTime = new Date()
      span.duration = span.endTime.getTime() - span.startTime.getTime()
      span.status = status
      if (error) {
        span.error = error
      }
    }
  }

  getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  getMetrics(): Metric[] {
    return [...this.metrics]
  }

  getTrace(traceId: string): TraceSpan[] {
    return this.traces.get(traceId) || []
  }

  clear(): void {
    this.logs = []
    this.metrics = []
    this.traces.clear()
  }
}

export const observabilityService = new ObservabilityService()
