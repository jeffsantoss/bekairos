import { CORS_ALLOWED_ORIGINS } from '@common/environment'
import { APIGatewayProxyResult } from 'aws-lambda'

interface Headers {
  [name: string]: string
}
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

const doReturn = (statusCode: StatusCode, body?: any, headers?: Headers, cookies?: Headers): APIGatewayProxyResult => {
  const stringHeaders = {}
  if (headers) Object.keys(headers).map((key) => (stringHeaders[key] = String(headers[key])))
  return {
    statusCode: statusCode.valueOf(),
    headers: {
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      'access-control-allow-origin': CORS_ALLOWED_ORIGINS,
      'Content-Type': 'application/json',
      ...(headers && stringHeaders)
    },
    multiValueHeaders: {
      ...(cookies && {
        'Set-Cookie': Object.keys(cookies).map((key) => `${key}=${cookies[key]}`)
      })
    },
    ...(body && { body: JSON.stringify(body) })
  }
}

const doErrorReturn = (statusCode: StatusCode, message: string, name: string, body?: any, headers?: Headers) =>
  doReturn(statusCode, body ?? { error: name, error_description: message }, headers)

export const ok = (body?: any, headers?: Headers, cookies?: Headers) => doReturn(StatusCode.OK, body, headers, cookies)
export const created = (body: any, headers?: Headers) => doReturn(StatusCode.CREATED, body, headers)
export const noContent = (headers?: Headers) => doReturn(StatusCode.NO_CONTENT, headers)
export const badRequest = (reason: string, name = 'bad_request') => doErrorReturn(StatusCode.BAD_REQUEST, reason, name)
export const unauthorized = (reason: string, name = 'unauthorized', headers?: Headers) =>
  doErrorReturn(StatusCode.UNAUTHORIZED, reason, name, null, headers)
export const forbidden = (reason: string, name = 'forbidden', headers?: Headers) =>
  doErrorReturn(StatusCode.FORBIDDEN, reason, name, null, headers)
export const notFound = (reason: string, name = 'not_found', headers?: Headers) =>
  doErrorReturn(StatusCode.NOT_FOUND, reason, name, null, headers)
export const conflict = (reason: string, name = 'conflict', headers?: Headers) =>
  doErrorReturn(StatusCode.CONFLICT, reason, name, null, headers)
export const internalServerError = (reason: string, name = 'internal_server_error', headers?: Headers) =>
  doErrorReturn(StatusCode.INTERNAL_SERVER_ERROR, reason, name, null, headers)

export const StatusHandler = {
  200: ok,
  204: created,
  400: badRequest,
  401: unauthorized,
  403: forbidden,
  404: notFound,
  409: conflict,
  500: internalServerError
}
