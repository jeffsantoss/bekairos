import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { authorizeResourceAccess } from '@common/security/authorizer-resource-access'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createScheduling } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await authorizeResourceAccess(event)

    const scheduleId = event.pathParameters.scheduleId

    return ok(await createScheduling(scheduleId))
  } catch (e) {
    return handleError(e)
  }
}
