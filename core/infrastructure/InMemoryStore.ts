/**
 * In-memory data store
 * Provides transaction-like semantics without a real database
 * In production, replace with PostgreSQL, MongoDB, etc.
 */
export class InMemoryStore {
  private collections: Map<string, Map<any, any>> = new Map()
  private snapshots: Map<string, any> = new Map()

  getCollection<T>(name: string): Map<any, T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map())
    }
    return this.collections.get(name)!
  }

  save<T>(collectionName: string, id: any, value: T): void {
    const collection = this.getCollection<T>(collectionName)
    collection.set(id, JSON.parse(JSON.stringify(value)))
  }

  findById<T>(collectionName: string, id: any): T | null {
    const collection = this.getCollection<T>(collectionName)
    const value = collection.get(id)
    return value ? JSON.parse(JSON.stringify(value)) : null
  }

  findAll<T>(collectionName: string): T[] {
    const collection = this.getCollection<T>(collectionName)
    return Array.from(collection.values()).map((v) => JSON.parse(JSON.stringify(v)))
  }

  delete(collectionName: string, id: any): void {
    const collection = this.getCollection(collectionName)
    collection.delete(id)
  }

  exists(collectionName: string, id: any): boolean {
    const collection = this.getCollection(collectionName)
    return collection.has(id)
  }

  count(collectionName: string): number {
    const collection = this.getCollection(collectionName)
    return collection.size
  }

  findByQuery<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
    skip: number = 0,
    limit: number = 100
  ): T[] {
    const collection = this.getCollection<T>(collectionName)
    return Array.from(collection.values())
      .filter((v) => predicate(JSON.parse(JSON.stringify(v))))
      .slice(skip, skip + limit)
      .map((v) => JSON.parse(JSON.stringify(v)))
  }

  // Snapshots for event sourcing
  saveSnapshot(key: string, snapshot: any): void {
    this.snapshots.set(key, JSON.parse(JSON.stringify(snapshot)))
  }

  getSnapshot(key: string): any | null {
    const snapshot = this.snapshots.get(key)
    return snapshot ? JSON.parse(JSON.stringify(snapshot)) : null
  }

  clear(): void {
    this.collections.clear()
    this.snapshots.clear()
  }

  clearCollection(name: string): void {
    this.collections.delete(name)
  }
}

export const inMemoryStore = new InMemoryStore()
