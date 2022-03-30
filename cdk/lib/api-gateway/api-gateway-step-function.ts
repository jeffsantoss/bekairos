import { ApiGatewayRestApi } from './api-gateway-rest-api'
import * as cdk from '@aws-cdk/core'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as apigw from '@aws-cdk/aws-apigateway'
import * as iam from '@aws-cdk/aws-iam'
import { MethodOptions } from '@aws-cdk/aws-apigateway'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { apiGatewayInvokeStepFunctionRole } from '../iam/roles'
import { ExpressStepFunction } from '../step-function/express-step-function'
import { StepFunctionApiGatewayOptions } from './models'

export class StepFunctionApiGateway extends ApiGatewayRestApi {
  stepFunctions: { [name: string]: sfn.StateMachine } = {}
  constructor(scope: cdk.Construct, props: StepFunctionApiGatewayOptions) {
    super(scope, props)
    const stepFunctionResources = props.resources.filter((resource) => resource.stepFunctionChain)
    stepFunctionResources.forEach((resource) => {
      const name = resource.path.replace(/\//, '_')
      this.stepFunctions[name] = new ExpressStepFunction(this, 'sf_' + name, resource.stepFunctionChain!)
    })
    const role = apiGatewayInvokeStepFunctionRole(
      this,
      Object.keys(this.stepFunctions).map((key) => this.stepFunctions[key].stateMachineArn)
    )

    stepFunctionResources.forEach((sfResource) => {
      const resourcePath = sfResource.path
      const name = sfResource.path.replace(/\//, '_')
      const apiResource = this.api.root.resourceForPath(resourcePath)
      apiResource.addMethod(
        sfResource.method,
        this.stepFunctionIntegration(this.stepFunctions[name].stateMachineArn, role),
        this.defaultMethodsRespose()
      )
      if (sfResource.enableCors)
        apiResource.addCorsPreflight({
          allowOrigins: ['*'],
          allowHeaders: ['*'],
          allowMethods: [sfResource.method]
        })

      new cdk.CfnOutput(this, `Endpoint${name}`, {
        value: this.api.urlForPath(apiResource.path)
      })
    })
  }

  stepFunctionIntegration = (stepFunctionArn: string, role: iam.IRole) => {
    return new apigw.Integration({
      type: apigw.IntegrationType.AWS,
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:${cdk.Aws.REGION}:states:action/StartSyncExecution`,
      options: {
        // @ts-ignore
        credentialsRole: role,
        passthroughBehavior: apigw.PassthroughBehavior.NEVER,
        requestTemplates: {
          'application/json': readFileSync(
            resolve(__dirname, '../templates/api-gateway-sf-request.vm'),
            'utf-8'
          ).replace('{{stateMachineArn}}', stepFunctionArn)
        },
        integrationResponses: [
          {
            selectionPattern: '200',
            statusCode: '201',
            responseTemplates: {
              'application/json': readFileSync(resolve(__dirname, '../templates/api-gateway-sf-response.vm'), 'utf-8')
            },
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'*'"
            }
          }
        ]
      }
    })
  }

  defaultMethodsRespose = (): MethodOptions => {
    return {
      methodResponses: [
        {
          statusCode: '201',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Expose-Headers': true
          }
        }
      ]
    }
  }
}
