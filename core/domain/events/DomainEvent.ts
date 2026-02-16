import { v4 as uuid } from 'uuid'

/**
 * Base Domain Event class
 * Domain events represent something that happened in the domain
 * They are immutable, timestamped, and uniquely identified
 */
export abstract class DomainEvent {
  readonly eventId: string
  readonly occurredAt: Date
  readonly aggregateId: string
  readonly aggregateType: string
  readonly correlationId: string
  readonly version: number

  constructor(
    aggregateId: string,
    aggregateType: string,
    correlationId: string,
    version: number = 1
  ) {
    this.eventId = uuid()
    this.occurredAt = new Date()
    this.aggregateId = aggregateId
    this.aggregateType = aggregateType
    this.correlationId = correlationId
    this.version = version
  }

  abstract getEventName(): string
  abstract getPayload(): Record<string, any>

  toPrimitives(): Record<string, any> {
    return {
      eventId: this.eventId,
      eventName: this.getEventName(),
      occurredAt: this.occurredAt.toISOString(),
      aggregateId: this.aggregateId,
      aggregateType: this.aggregateType,
      correlationId: this.correlationId,
      version: this.version,
      payload: this.getPayload(),
    }
  }
}
