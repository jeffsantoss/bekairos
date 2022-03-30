import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEvent } from 'aws-lambda'

export const createRequestObject = (
  method: string,
  body: any,
  headers?: { [name: string]: string },
  pathParameters?: { [name: string]: string }
): APIGatewayProxyEvent => {
  const authorizer: APIGatewayEventDefaultAuthorizerContext = {}
  return {
    body,
    headers: headers ?? {},
    multiValueHeaders: {},
    httpMethod: method,
    isBase64Encoded: false,
    path: '/',
    pathParameters: pathParameters ?? {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      authorizer: authorizer,
      accountId: '123456789012',
      resourceId: '123456',
      stage: 'prod',
      requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
      requestTime: '09/Apr/2015:12:34:56 +0000',
      requestTimeEpoch: 1428582896000,
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '192.168.0.1',
        user: null,
        userAgent: null,
        userArn: null
      },
      path: '/prod/path/to/resource',
      resourcePath: '/{proxy+}',
      httpMethod: method,
      apiId: '1234567890',
      protocol: 'HTTP/1.1'
    },
    resource: '/'
  }
}
