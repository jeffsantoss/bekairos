import { listDirs } from '../utils/list-dir'
import { Construct } from '@aws-cdk/core'
import { Lambda } from './lambda'
import { LambdaProps } from './models'
import { resolve } from 'path'

export const createLambdaInBatch = (
  scope: Construct,
  directory: string,
  lambdaProps: LambdaProps,
  qualifier = 'handler.ts'
): { [name: string]: Lambda } => {
  const lambdaPaths = listDirs(directory)
  const functions: { [name: string]: Lambda } = {}
  lambdaPaths.forEach((path) => {
    const props = lambdaProps
    props.functionName = path
    props.handlerPath = `${directory}/${path}/${qualifier}`
    console.log(props.handlerPath)
    functions[path] = new Lambda(scope, props)
  })
  return functions
}
