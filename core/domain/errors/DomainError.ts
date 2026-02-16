/**
 * Base Domain Error for all domain-level exceptions
 * Part of enterprise-grade error handling in Clean Architecture
 */
export abstract class DomainError extends Error {
  readonly isOperational: boolean = true
  readonly code: string
  readonly statusCode: number

  constructor(code: string, message: string, statusCode: number = 400) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    Object.setPrototypeOf(this, DomainError.prototype)
  }

  static isOperationalError(error: Error): error is DomainError {
    return error instanceof DomainError && error.isOperational === true
  }
}

export class InvalidArgumentError extends DomainError {
  constructor(message: string) {
    super('INVALID_ARGUMENT', message, 400)
    Object.setPrototypeOf(this, InvalidArgumentError.prototype)
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super('NOT_FOUND', message, 404)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class RateLimitError extends DomainError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_EXCEEDED', message, 429)
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}
