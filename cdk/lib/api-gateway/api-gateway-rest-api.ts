import * as cdk from '@aws-cdk/core'
import { ApiGatewayRestApiProps } from './models'
import * as apigw from '@aws-cdk/aws-apigateway'
import { Method } from '@aws-cdk/aws-apigateway'

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
          resource.addMethod(
            resourceProps.method,
            // @ts-ignore
            new apigw.LambdaIntegration(resourceProps.lambdaIntegration!, { proxy: true })
          )
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
