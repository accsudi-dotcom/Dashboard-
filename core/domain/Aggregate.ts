import { Entity } from './Entity'
import type { DomainEvent } from './events/DomainEvent'

/**
 * Aggregate base class
 * An aggregate is a cluster of domain objects (entities and value objects)
 * treated as a single unit. It enforces transactional consistency within its boundary.
 * 
 * Aggregates:
 * - Have one root entity (the aggregate root)
 * - Encapsulate internal consistency rules
 * - Emit domain events for side effects
 * - Can only be accessed through their root
 */
export abstract class Aggregate<T> extends Entity<T> {
  protected version: number = 0

  getVersion(): number {
    return this.version
  }

  incrementVersion(): void {
    this.version++
  }

  /**
   * Ensures aggregate is in a valid state
   * Called before persistence
   */
  abstract validate(): void

  /**
   * Reconstructs aggregate from stored events (Event Sourcing)
   */
  abstract applyEvent(event: DomainEvent): void

  /**
   * Returns all uncommitted events since last persistence
   */
  getUncommittedEvents(): DomainEvent[] {
    return this.getDomainEvents()
  }

  /**
   * Mark all events as committed
   */
  markEventsAsCommitted(): void {
    this.clearDomainEvents()
  }
}
