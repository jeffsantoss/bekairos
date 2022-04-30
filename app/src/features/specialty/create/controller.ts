import { handleError } from '@common/errors/handle-error'
import { created } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createSpecialty } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event) somente master acessar
    const id = await createSpecialty(JSON.parse(event.body))
    return created({ id })
  } catch (e) {
    return handleError(e)
  }
}
