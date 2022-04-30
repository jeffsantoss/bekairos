import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllSpecialties } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event) somente master acessar
    const all = await getAllSpecialties()
    return ok(all)
  } catch (e) {
    return handleError(e)
  }
}
