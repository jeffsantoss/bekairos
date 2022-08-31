import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getScheduleById } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return ok(await getScheduleById(event.pathParameters.id))
  } catch (e) {
    return handleError(e)
  }
}
