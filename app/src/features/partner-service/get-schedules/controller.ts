import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getScheduleByPartnerService } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return ok(
      await getScheduleByPartnerService({
        serviceId: event.pathParameters.id,
        date: event.queryStringParameters?.date ? Number.parseInt(event.queryStringParameters?.date) : undefined
      })
    )
  } catch (e) {
    return handleError(e)
  }
}
