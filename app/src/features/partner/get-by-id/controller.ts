import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllPartners } from '../get/usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event)

    return ok(
      await getAllPartners({
        lat: event.queryStringParameters?.latitude,
        long: event.queryStringParameters?.longitude
      })
    )
  } catch (e) {
    return handleError(e)
  }
}
