/**
 * Value Object base class
 * Value Objects have no identity - they are defined by their value
 * They are immutable and support value equality
 */
export abstract class ValueObject<T> {
  protected value: T

  constructor(value: T) {
    this.validate(value)
    this.value = Object.freeze(value)
  }

  getValue(): T {
    return this.value
  }

  equals(other: ValueObject<T>): boolean {
    if (!(other instanceof this.constructor)) {
      return false
    }
    return JSON.stringify(this.value) === JSON.stringify(other.value)
  }

  abstract validate(value: T): void

  abstract toPrimitives(): any
}
