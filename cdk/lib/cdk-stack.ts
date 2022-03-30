import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'


const SRC_FEATURES = '../app/src/features'
export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const dynamoPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*']
    })
  }
}
