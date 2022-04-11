import { UnauthorizedError } from '@common/errors/api-errors'
import { APIGatewayAuthorizerEvent, APIGatewayProxyEvent, APIGatewayRequestAuthorizerEvent } from 'aws-lambda'
import jwksClient from 'jwks-rsa'
import * as jwt from 'jsonwebtoken'
import caseInsensitiveGet from '@common/utils/case-insensitive-get'

export type JWTTokenPayload = {
  [claim: string]: any
}

let jwksKeysClient: jwksClient.JwksClient

if (process.env.JWKS_URI) {
  jwksKeysClient = jwksClient({
    jwksUri: process.env.JWKS_URI
  })
} else {
  throw new Error('JWT authentication error: environment variable JWKS_URI is not defined!')
}

export const authorize = async (jwtTokenString: string) => {
  try {
    const jwtToken = jwt.decode(jwtTokenString, { complete: true })
    if (!jwtToken) {
      throw Error('JWT token decode returned null')
    }
    const token = jwtToken as jwt.Jwt
    const kid = token.header.kid
    const signingKey = await jwksKeysClient.getSigningKey(kid)
    const publicKey = signingKey.getPublicKey()
    jwt.verify(jwtTokenString, publicKey as jwt.Secret)
    return jwtToken
  } catch (e) {
    console.warn('JWT token invalid:', e)
    throw new UnauthorizedError()
  }
}

export const jwtTokenFromAuthorizationHeader = (event: APIGatewayAuthorizerEvent | APIGatewayProxyEvent) => {
  const requestAuthorizerEvent = event as APIGatewayRequestAuthorizerEvent
  const authorization = caseInsensitiveGet('Authorization', requestAuthorizerEvent.headers ?? {})
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError()
  }
  return authorization.slice('Bearer '.length)
}
