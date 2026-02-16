import type { Aggregate } from '../domain/Aggregate'
import type { Repository, Query } from '../domain/repositories/Repository'
import { InMemoryStore } from './InMemoryStore'
import { globalUnitOfWork } from './UnitOfWork'

/**
 * Base Repository implementation using in-memory store
 * Implements the Repository pattern for aggregates
 * Can be extended to support real databases
 */
export abstract class BaseRepository<T extends Aggregate<ID>, ID> implements Repository<T, ID> {
  protected collectionName: string
  protected store: InMemoryStore

  constructor(collectionName: string, store: InMemoryStore) {
    this.collectionName = collectionName
    this.store = store
  }

  async save(aggregate: T): Promise<void> {
    aggregate.validate()
    const primitives = aggregate.toPrimitives()
    this.store.save(this.collectionName, aggregate.getId(), primitives)
    globalUnitOfWork.registerChanged(aggregate)
  }

  async saveAll(aggregates: T[]): Promise<void> {
    for (const aggregate of aggregates) {
      await this.save(aggregate)
    }
  }

  async findById(id: ID): Promise<T | null> {
    const data = this.store.findById(this.collectionName, id)
    return data ? this.reconstruct(data) : null
  }

  async findByIds(ids: ID[]): Promise<T[]> {
    const results: T[] = []
    for (const id of ids) {
      const aggregate = await this.findById(id)
      if (aggregate) {
        results.push(aggregate)
      }
    }
    return results
  }

  async findAll(): Promise<T[]> {
    const data = this.store.findAll(this.collectionName)
    return data.map((d) => this.reconstruct(d))
  }

  async delete(id: ID): Promise<void> {
    this.store.delete(this.collectionName, id)
  }

  async deleteAll(ids: ID[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }

  async exists(id: ID): Promise<boolean> {
    return this.store.exists(this.collectionName, id)
  }

  async count(): Promise<number> {
    return this.store.count(this.collectionName)
  }

  /**
   * Must be implemented by subclasses to reconstruct aggregate from primitives
   */
  protected abstract reconstruct(data: Record<string, any>): T
}
