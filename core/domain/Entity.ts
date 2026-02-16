import type { DomainEvent } from './events/DomainEvent'

/**
 * Base Entity class following Domain-Driven Design principles
 * Entities have identity and mutable state
 * All entities emit domain events for event-sourcing and audit trails
 */
export abstract class Entity<T> {
  protected id: T
  protected createdAt: Date
  protected updatedAt: Date
  protected _domainEvents: DomainEvent[] = []

  constructor(id: T, createdAt?: Date, updatedAt?: Date) {
    this.id = id
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  getId(): T {
    return this.id
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  getDomainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  clearDomainEvents(): void {
    this._domainEvents = []
  }

  protected markAsUpdated(): void {
    this.updatedAt = new Date()
  }

  equals(other: Entity<T>): boolean {
    if (!(other instanceof Entity)) {
      return false
    }
    return this.id === other.id
  }

  abstract toPrimitives(): Record<string, any>
}
