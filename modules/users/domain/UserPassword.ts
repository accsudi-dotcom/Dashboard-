import { ValueObject } from '@/core/domain/ValueObject'
import { InvalidArgumentError } from '@/core/domain/errors/DomainError'
import bcrypt from 'bcryptjs'

export class UserPassword extends ValueObject<{ hash: string; salt: string }> {
  validate(value: { hash: string; salt: string }): void {
    if (!value.hash || value.hash.length === 0) {
      throw new InvalidArgumentError('Invalid password format')
    }
  }

  static create(plainPassword: string): UserPassword {
    // Use bcrypt for hashing (sync variant for simplicity in domain object)
    const saltRounds = 10
    const hash = bcrypt.hashSync(plainPassword, saltRounds)
    // Bcrypt hash contains the salt; store a substring as salt for compatibility
    const salt = hash.substring(0, 29)
    return new UserPassword({ hash, salt })
  }

  matches(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.value.hash)
  }

  toPrimitives(): Record<string, any> {
    return {
      hash: this.value.hash,
      salt: this.value.salt,
    }
  }
}
