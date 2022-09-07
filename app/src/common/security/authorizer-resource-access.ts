import { APIGatewayProxyEvent } from 'aws-lambda'
import { authorize, jwtTokenFromAuthorizationHeader, JWTTokenPayload } from './authorizer'

let jwtTokenPayloadSingleton: JWTTokenPayload = {}

export const authorizeResourceAccess = async (
  event: APIGatewayProxyEvent,
  scopes?: string[]
): Promise<JWTTokenPayload> => {
  const jwtTokenString = jwtTokenFromAuthorizationHeader(event)

  const jwtToken = await authorize(jwtTokenString)
  console.log(`Event: ${JSON.stringify(event)}`)
  console.log(`JWT: ${JSON.stringify(jwtToken)}`)
  jwtTokenPayloadSingleton = JSON.parse(jwtToken.payload as string)

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
