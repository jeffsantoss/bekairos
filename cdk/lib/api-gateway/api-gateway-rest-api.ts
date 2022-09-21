import * as cdk from '@aws-cdk/core'
import { ApiGatewayRestApiProps } from './models'
import * as apigw from '@aws-cdk/aws-apigateway'
import { AuthorizationType, CfnAuthorizer, Method } from '@aws-cdk/aws-apigateway'
import * as cognito from '@aws-cdk/aws-cognito'
import { ENVIRONMENT } from '../environment'

export class ApiGatewayRestApi extends cdk.Construct {
  api: apigw.RestApi

  constructor(scope: cdk.Construct, props: ApiGatewayRestApiProps) {
    super(scope, props.name)
    this.api = this.createRestApi(props)
  }

  createRestApi = (props: ApiGatewayRestApiProps): apigw.RestApi => {
    const api = new apigw.RestApi(this, props.name, {
      deploy: false,
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL]
      }
    })


    const userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: `BeKairos-${ENVIRONMENT}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    const auth = new CfnAuthorizer(this, 'APIGatewayAuthorizer', {
      name: `BeKairosAuth`,
      identitySource: 'method.request.header.Authorization',
      providerArns: [userPool.userPoolArn],
      restApiId: api.restApiId,
      type: AuthorizationType.COGNITO,
    })

    props.resources
      ?.filter((resource) => resource.lambdaIntegration)
      .forEach((resourceProps) => {
        const resource = api.root.resourceForPath(resourceProps.path)

        if (resourceProps.enableCors && resource.path == '/')
          resource.addCorsPreflight({
            allowOrigins: ['*'],
            allowHeaders: ['*'],
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
          })

        if (!(resource.parentResource?.node.tryFindChild(resourceProps.method) instanceof Method)) {
          if (resourceProps.authorizer) {
            resource.addMethod(
              resourceProps.method,
              // @ts-ignore
              new apigw.LambdaIntegration(resourceProps.lambdaIntegration!, { proxy: true }),

              {
                authorizationType: AuthorizationType.COGNITO,
                authorizer: { authorizerId: auth.ref }                
              }
            )
          } else {
            resource.addMethod(
              resourceProps.method,
              // @ts-ignore
              new apigw.LambdaIntegration(resourceProps.lambdaIntegration!, { proxy: true })
            )
          }
        }

      })

    const deployment = new apigw.Deployment(this, props.nameDeployment, { api })

    api.deploymentStage = new apigw.Stage(this, 'stage', {
      deployment: deployment,
      stageName: props.stage
    })

    return api
  }
}
