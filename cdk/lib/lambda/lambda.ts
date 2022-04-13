import * as lambda from '@aws-cdk/aws-lambda'
import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import { LambdaProps } from './models'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { ATTACH_VPC, ENVIRONMENT, SECURITY_GROUP_ID, SUBNET_IDS, VPC_ID } from '../environment'

export class Lambda extends cdk.Construct {
  func: lambda.Function

  constructor(scope: cdk.Construct, props: LambdaProps) {
    super(scope, props.functionName!)
    this.func = this.createLambda(props)
  }

  createLambda = (props: LambdaProps): lambda.Function => {
    const func = new NodejsFunction(this, props.functionName!, {
      memorySize: 256,
      timeout: props.timeout ?? cdk.Duration.seconds(60 * 5),
      layers: props.layers,
      runtime: props.runtime ?? lambda.Runtime.NODEJS_14_X,
      entry: path.join(__dirname, props.handlerPath!),
      bundling: {
        minify: false
      },
      tracing: lambda.Tracing.ACTIVE,      
    })

    if (props.env) Object.keys(props.env).map((key: string) => func.addEnvironment(key, props.env![key]))

    func.addEnvironment('NODE_ENV', ENVIRONMENT)

    props.policies?.forEach((policy) => {
      func.addToRolePolicy(policy)
    })
    return func
  }
}
