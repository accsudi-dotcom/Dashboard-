import type { DomainEvent } from './DomainEvent'

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void

/**
 * In-memory Event Bus for domain event publishing and subscription
 * In production, this would be replaced with RabbitMQ, Kafka, or similar
 */
export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map()
  private eventHistory: DomainEvent[] = []
  private deadLetterQueue: Array<{ event: DomainEvent; error: Error }> = []

  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)!.push(handler)
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName()
    this.eventHistory.push(event)

    const handlers = this.handlers.get(eventName) || []

    for (const handler of handlers) {
      try {
        await Promise.resolve(handler(event))
      } catch (error) {
        // In production: use retry logic with exponential backoff
        this.deadLetterQueue.push({
          event,
          error: error instanceof Error ? error : new Error(String(error)),
        })
      }
    }
  }

  async publishMultiple(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event)
    }
  }

  getEventHistory(): DomainEvent[] {
    return [...this.eventHistory]
  }

  getDeadLetterQueue(): Array<{ event: DomainEvent; error: Error }> {
    return [...this.deadLetterQueue]
  }

  clear(): void {
    this.handlers.clear()
    this.eventHistory = []
    this.deadLetterQueue = []
  }
}

// Global singleton instance
export const eventBus = new EventBus()
