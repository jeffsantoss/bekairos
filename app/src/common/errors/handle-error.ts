import { StatusCode, StatusHandler } from '@common/responses/responses'
import { ApiError } from './api-errors'

export const handleError = (error: any) => {
  console.error('Failed to process the request', error)

  switch (true) {
    case error instanceof ApiError:
      return (StatusHandler[error.statusCode] ?? StatusHandler[StatusCode.BAD_REQUEST])(error.message, error.name)
    default:
      return StatusHandler[StatusCode.INTERNAL_SERVER_ERROR](`Something went wrong`)
  }
}
