import * as lambda from '@aws-cdk/aws-lambda'
import { LayerVersion } from '@aws-cdk/aws-lambda'
import { Duration } from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'

export interface LambdaProps {
  functionName?: string
  handlerPath?: string
  runtime?: lambda.Runtime
  lambda?: lambda.Function
  timeout?: Duration
  layers?: LayerVersion[]
  env?: { [name: string]: string }
  policies?: iam.PolicyStatement[]
  attachVpc?: boolean
}
