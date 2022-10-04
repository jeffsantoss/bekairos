import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from './lambda/lambda'
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

    const commonEnv = {
      JWKS_URI: process.env.JWKS_URI ?? 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_VlTHXoqz4/.well-known/jwks.json'
    }


    // lambdas
    const lambdaPartnerCreate = new lambda.Lambda(this, {
      functionName: 'partner-create',
      handlerPath: `${SRC_FEATURES}/partner/create/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaPartnerGetBySpecialty = new lambda.Lambda(this, {
      functionName: 'partner-get-by-specialty',
      handlerPath: `${SRC_FEATURES}/partner/get-by-specialty/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaGetPartnerById = new lambda.Lambda(this, {
      functionName: 'partner-get-by-id',
      handlerPath: `${SRC_FEATURES}/partner/get-by-id/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })


    const lambdaGetPartners = new lambda.Lambda(this, {
      functionName: 'partner-get-all',
      handlerPath: `${SRC_FEATURES}/partner/get/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })


    const lambdaCreateTicket = new lambda.Lambda(this, {
      functionName: 'create-ticket',
      handlerPath: `${SRC_FEATURES}/ticket/create/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaGetTicket = new lambda.Lambda(this, {
      functionName: 'ticket-get',
      handlerPath: `${SRC_FEATURES}/ticket/get/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaSpecialtyCreate = new lambda.Lambda(this, {
      functionName: 'specialty-create',
      handlerPath: `${SRC_FEATURES}/specialty/create/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaSpecialtyGet = new lambda.Lambda(this, {
      functionName: 'specialty-get',
      handlerPath: `${SRC_FEATURES}/specialty/get/controller.ts`,
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaScheduleCreate = new lambda.Lambda(this, {
      functionName: 'schedule-create',
      handlerPath: `${SRC_FEATURES}/schedule/create/controller.ts`,
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const scheduleGetById = new lambda.Lambda(this, {
      functionName: 'schedule-get-by-id',
      handlerPath: `${SRC_FEATURES}/schedule/get-by-id/controller.ts`,
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaPartnerServiceCreate = new lambda.Lambda(this, {
      functionName: 'partner-service-create',
      handlerPath: `${SRC_FEATURES}/partner-service/create/controller.ts`,
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy],
      env: commonEnv
    })



    const lambdaGetScheduleFromPartnerService = new lambda.Lambda(this, {
      functionName: 'partner-service-get-schedules',
      handlerPath: `${SRC_FEATURES}/partner-service/get-schedules/controller.ts`,
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy],
      env: commonEnv
    })

    const lambdaPartnerMemberCreate = new lambda.Lambda(this, {
      functionName: 'partner-member-create',
      handlerPath: `${SRC_FEATURES}/partner-member/create/controller.ts`,
      timeout: cdk.Duration.seconds(60 * 5),
      policies: [dynamoPolicy],
      env: commonEnv
    })

    // api gtw

    const beKairosRestApi = new ApiGatewayRestApi(this, {
      name: "bekairos-api",
      nameDeployment: `${ENVIRONMENT}-deployment`,
      stage: ENVIRONMENT,
      resources: [
        {
          path: "/partner",
          enableCors: true,
          lambdaIntegration: lambdaPartnerCreate.func,
          method: "POST",
          authorizer: true,
        },
        {
          path: "/partner/specialty/{id}",
          enableCors: true,
          lambdaIntegration: lambdaPartnerGetBySpecialty.func,
          method: "GET"
        },
        {
          path: "/partner/{id}",
          enableCors: true,
          lambdaIntegration: lambdaGetPartnerById.func,
          method: "GET",
        },
        {
          path: "/partner",
          enableCors: true,
          lambdaIntegration: lambdaGetPartners.func,
          method: "GET"
        },
        {
          path: "/ticket",
          enableCors: true,
          lambdaIntegration: lambdaCreateTicket.func,
          method: "POST"
        },
        {
          path: "/ticket",
          enableCors: true,
          lambdaIntegration: lambdaGetTicket.func,
          method: "GET"
        },
        {
          path: "/specialty",
          enableCors: true,
          lambdaIntegration: lambdaSpecialtyCreate.func,
          method: "POST"
        },
        {
          path: "/specialty",
          enableCors: false,
          lambdaIntegration: lambdaSpecialtyGet.func,
          method: "GET"
        },
        {
          path: "/schedule",
          enableCors: true,
          lambdaIntegration: lambdaScheduleCreate.func,
          method: "POST"
        },
        {
          path: "/schedule/{id}",
          enableCors: true,
          lambdaIntegration: scheduleGetById.func,
          method: "GET"
        },
        {
          path: "/partner-service/",
          enableCors: true,
          lambdaIntegration: lambdaPartnerServiceCreate.func,
          method: "POST"
        },
        {
          path: "/partner-service/{id}/schedule",
          enableCors: true,
          lambdaIntegration: lambdaGetScheduleFromPartnerService.func,
          method: "GET"
        }, 
        {
          path: "/partner-member/",
          enableCors: true,
          lambdaIntegration: lambdaPartnerMemberCreate.func,
          method: "POST"
        }

      ]
    })

  }
}
