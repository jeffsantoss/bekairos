import { APIGatewayProxyEvent } from 'aws-lambda'
import { JwtPayload } from 'jsonwebtoken'
import { authorize, jwtTokenFromAuthorizationHeader, JWTTokenPayload } from './authorizer'

let jwtTokenPayloadSingleton: JwtPayload = {}

export const authorizeResourceAccess = async (event: APIGatewayProxyEvent, scopes?: string[]): Promise<JwtPayload> => {
  const jwtTokenString = jwtTokenFromAuthorizationHeader(event)

  const jwtToken = await authorize(jwtTokenString)

  console.log(`Event: ${JSON.stringify(event)}`)
  console.log(`JWT: ${JSON.stringify(jwtToken)}`)
  jwtTokenPayloadSingleton = jwtToken.payload as JwtPayload

  // if (scopes) checkScopes(scopes)

  return jwtTokenPayloadSingleton
}

// const checkScopes = (jwtPayload: any, ...args: string[]) => {
//   try {
//     const roles = jwtPayload['scopes'] as Array<string>

//     if (!roles) return false

//     console.log(`scopes from JWT: ${JSON.stringify(roles)}`)

//     return roles.every((r) => args.includes(r))
//   } catch (e) {
//     console.log(`Failed to get scopes on JWT: ${e}`)
//     return false
//   }
// }

export default jwtTokenPayloadSingleton
