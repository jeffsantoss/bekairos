import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda'
import { authorize, jwtTokenFromAuthorizationHeader, JWTTokenPayload } from '../../common/security/authorizer'

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  try {
    const requestEvent = event as APIGatewayRequestAuthorizerEvent

    if (requestEvent.httpMethod.toLocaleLowerCase() === 'options') {
      console.log('Method OPTIONS....allowing pass-through')
      return allow(requestEvent, { sub: 'anonymous' })
    }

    console.log('Getting JWT token from authorization header...')

    const jwtTokenString = jwtTokenFromAuthorizationHeader(event)

    console.log(`Authorizing JWT token...`)

    const jwtToken = await authorize(jwtTokenString)

    const policy = allow(requestEvent, jwtToken.payload)

    console.log(`policy: ${JSON.stringify(policy, null, 2)}`)
    return policy
  } catch (e) {
    throw 'Unauthorized'
  }
}

const allow = (
  event: APIGatewayRequestAuthorizerEvent,
  jwtTokenPayload: JWTTokenPayload | string
): APIGatewayAuthorizerResult => ({
  principalId: jwtTokenPayload instanceof String ? JSON.parse(jwtTokenPayload as string).sub : jwtTokenPayload.sub,
  policyDocument: policy(event, 'Allow')
})

const policy = (event: APIGatewayRequestAuthorizerEvent, effect: 'Allow' | 'Deny') => {
  const region = process.env.AWS_REGION
  const ctx = event.requestContext
  const { accountId, apiId, stage } = ctx
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: `arn:aws:execute-api:${region}:${accountId}:${apiId}/${stage}/*`
      }
    ]
  }
}
