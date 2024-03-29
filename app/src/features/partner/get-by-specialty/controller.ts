import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getBySpecialty } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const specialtyId = event?.pathParameters?.id

    return ok(
      await getBySpecialty(specialtyId, {
        lat: event.queryStringParameters?.latitude,
        long: event.queryStringParameters?.longitude
      })
    )
  } catch (e) {
    return handleError(e)
  }
}
