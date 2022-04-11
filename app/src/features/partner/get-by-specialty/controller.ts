import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getBySpecialty } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event)

    const specialtyId = event.pathParameters.specialtyId
    const body = JSON.parse(event.body)

    return ok(await getBySpecialty(specialtyId, { lat: body.coordinates.lat, long: body.coordinates.long }))
  } catch (e) {
    return handleError(e)
  }
}
