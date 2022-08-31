import { handleError } from '@common/errors/handle-error'
import { created } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createPartnerService, CreatePartnerServiceRequest } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event) somente master acessar
    const body = JSON.parse(event.body)

    const req: CreatePartnerServiceRequest = {
      name: body.name,
      partnerId: body.partnerId,
      price: body.price,
      description: body.description
    }

    const id = await createPartnerService(req)
    return created({ id })
  } catch (e) {
    return handleError(e)
  }
}
