import { StatusCode } from '@common/responses/responses'

export class ApiError extends Error {
  /**
   * The HTTP error code.
   */
  statusCode: number
  /**
   * The Application error code.
   */
  message: string
  /**
   * A human-readable error message.
   */
  name: string

  constructor(statusCode: number, message: string, name?: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.name = name
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class MissingArgumentError extends ApiError {
  constructor(argument: string) {
    super(StatusCode.BAD_REQUEST, `Missing attribute ${argument}`, 'invalid_argument')
  }
}

export class BadArgumentError extends ApiError {
  constructor(argument: string, name?: string) {
    super(StatusCode.BAD_REQUEST, `Bad argument: ${argument}`, name)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(argument?: string) {
    super(StatusCode.UNAUTHORIZED, `Unauthorized` + (argument ? `:${argument}` : ''))
  }
}
export class ForbiddenError extends ApiError {
  constructor(argument?: string) {
    super(StatusCode.FORBIDDEN, `Forbidden` + (argument ? `:${argument}` : ''))
  }
}

export class ConflictError extends ApiError {
  constructor(argument?: string) {
    super(StatusCode.CONFLICT, `Resource already exists` + (argument ? `: ${argument}` : ''))
  }
}

export class NotFoundError extends ApiError {
  constructor(argument: string) {
    super(StatusCode.NOT_FOUND, `Resource not found: ${argument}`)
  }
}
