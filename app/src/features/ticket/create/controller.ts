import { handleError } from '@common/errors/handle-error'
import { created, ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTicket } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    //await authorizeResourceAccess(event)
    const body = JSON.parse(event.body)
    const id = await createTicket(body.scheduleId)
    return created({ id })
  } catch (e) {
    return handleError(e)
  }
}
