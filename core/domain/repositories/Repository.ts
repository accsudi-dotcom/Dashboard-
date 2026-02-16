import type { Aggregate } from '../Aggregate'

/**
 * Generic Repository interface
 * Abstracts data access for aggregates
 * Enables swapping in-memory implementation with real database
 */
export interface Repository<T extends Aggregate<any>, ID> {
  save(aggregate: T): Promise<void>
  saveAll(aggregates: T[]): Promise<void>
  findById(id: ID): Promise<T | null>
  findByIds(ids: ID[]): Promise<T[]>
  findAll(): Promise<T[]>
  delete(id: ID): Promise<void>
  deleteAll(ids: ID[]): Promise<void>
  exists(id: ID): Promise<boolean>
  count(): Promise<number>
}

/**
 * Query interface for complex filtering
 */
export interface Query {
  filter?: Record<string, any>
  sort?: Record<string, 1 | -1>
  skip?: number
  limit?: number
}

export interface QueryableRepository<T extends Aggregate<any>, ID> extends Repository<T, ID> {
  findByQuery(query: Query): Promise<T[]>
  countByQuery(query: Query): Promise<number>
}
