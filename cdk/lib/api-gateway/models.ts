import * as lambda from '@aws-cdk/aws-lambda'
import * as sfn from '@aws-cdk/aws-stepfunctions'
export interface ApiGatewayRestApiProps {
  name: string
  nameDeployment: string
  stage: string
  resources?: ApiGatewayRestApiResourceProps[]
}

export interface ApiGatewayRestApiResourceProps {
  path: string
  enableCors: boolean
  lambdaIntegration?: lambda.Function
  method: string
}
export interface StepFunctionApiGatewayOptions extends ApiGatewayRestApiProps {
  resources: (ApiGatewayRestApiResourceProps & { stepFunctionChain?: sfn.IChainable })[]
}
