import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTicket } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    //await authorizeResourceAccess(event)

    const scheduleId = event.pathParameters.scheduleId

    return ok(await createTicket(scheduleId))
  } catch (e) {
    return handleError(e)
  }
}
