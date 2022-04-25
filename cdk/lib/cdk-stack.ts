import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import { Lambda } from './lambda/lambda'
import { ENVIRONMENT } from './environment'
import { ApiGatewayRestApi } from './api-gateway/api-gateway-rest-api'


const SRC_FEATURES = '../../../app/src/features'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const dynamoPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*']
    })

    // lambdas
    const lambdaPartnerGetBySpecialty = new Lambda(this, {
      functionName: 'partner-get-by-specialty',
      handlerPath: `${SRC_FEATURES}/partner/get-by-specialty/controller.ts`,      
      policies: [dynamoPolicy]      
    })

    const lambdaScheduleCreate = new Lambda(this, {
      functionName: 'schedule-create',
      handlerPath: `${SRC_FEATURES}/schedule/create/controller.ts`,      
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy]      
    })

    // api gtw

    const beKairosRestApi = new ApiGatewayRestApi(this, {
      name: "bekairos-api",
      nameDeployment: `${ENVIRONMENT}-deployment`,
      stage: ENVIRONMENT,
      resources: [
        {
          path: "/partner/{specialtyId}/specialty",
          enableCors: true,
          lambdaIntegration: lambdaPartnerGetBySpecialty.func,
          method: "GET"
        },      
        {
          path: "/schedule",
          enableCors: true,
          lambdaIntegration: lambdaScheduleCreate.func,
          method: "POST"
        }
      ]
    })

  }
}
