import { ValueObject } from '@/core/domain/ValueObject'
import { InvalidArgumentError } from '@/core/domain/errors/DomainError'

export class UserEmail extends ValueObject<string> {
  validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new InvalidArgumentError(`Invalid email format: ${value}`)
    }
  }

  static create(email: string): UserEmail {
    return new UserEmail(email.toLowerCase())
  }

  toPrimitives(): string {
    return this.value
  }
}
