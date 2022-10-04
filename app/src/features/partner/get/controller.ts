import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { authorizeResourceAccess } from '@common/security/authorizer-resource-access'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllPartners } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await authorizeResourceAccess(event)

    return ok(await getAllPartners(JSON.parse(event.body)))
  } catch (e) {
    return handleError(e)
  }
}
