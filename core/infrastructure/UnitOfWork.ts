import type { Aggregate } from '../domain/Aggregate'
import { eventBus } from '../domain/events/EventBus'

/**
 * Unit of Work pattern for transaction management
 * Coordinates changes to multiple aggregates atomically
 * Ensures all events are published after successful persistence
 */
export class UnitOfWork {
  private newAggregates: Set<Aggregate<any>> = new Set()
  private changedAggregates: Set<Aggregate<any>> = new Set()
  private deletedAggregates: Set<Aggregate<any>> = new Set()

  registerNew(aggregate: Aggregate<any>): void {
    this.newAggregates.add(aggregate)
  }

  registerChanged(aggregate: Aggregate<any>): void {
    this.changedAggregates.add(aggregate)
  }

  registerDeleted(aggregate: Aggregate<any>): void {
    this.deletedAggregates.add(aggregate)
  }

  async commit(): Promise<void> {
    try {
      // In production: wrap in database transaction
      // Persist new aggregates
      for (const aggregate of this.newAggregates) {
        aggregate.validate()
        // Persistence happens at repository level
      }

      // Persist changed aggregates
      for (const aggregate of this.changedAggregates) {
        aggregate.validate()
      }

      // Delete aggregates
      for (const aggregate of this.deletedAggregates) {
        // Deletion happens at repository level
      }

      // Publish all domain events
      const allAggregates = [
        ...this.newAggregates,
        ...this.changedAggregates,
        ...this.deletedAggregates,
      ]

      for (const aggregate of allAggregates) {
        const events = aggregate.getUncommittedEvents()
        for (const event of events) {
          await eventBus.publish(event)
        }
        aggregate.markEventsAsCommitted()
      }

      this.clear()
    } catch (error) {
      this.clear()
      throw error
    }
  }

  rollback(): void {
    this.clear()
  }

  private clear(): void {
    this.newAggregates.clear()
    this.changedAggregates.clear()
    this.deletedAggregates.clear()
  }
}

export const globalUnitOfWork = new UnitOfWork()
