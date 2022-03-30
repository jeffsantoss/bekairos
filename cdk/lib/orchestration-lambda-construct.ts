import * as cdk from '@aws-cdk/core'
import { createLambdaInBatch } from './lambda/helper'
import { Lambda } from './lambda/lambda'

const SRC_HANDLER = '../../apps/bff/src/handler'

export class OrchestrationLambdaConstruct extends cdk.Construct {
  functions: { [name: string]: Lambda }

  constructor(scope: cdk.Construct, params: any) {
    super(scope, 'bff')

    this.functions = createLambdaInBatch(this, SRC_HANDLER, {})
  }
}
