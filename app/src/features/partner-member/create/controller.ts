import { handleError } from '@common/errors/handle-error'
import { created } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createPartnerMember, CreatePartnerMemberRequest } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // await authorizeResourceAccess(event) somente master acessar
    const body = JSON.parse(event.body)

    const req: CreatePartnerMemberRequest = {
      name: body.name,
      partnerServiceId: body.partnerServiceId
    }

    const id = await createPartnerMember(req)

    return created({ id })
  } catch (e) {
    return handleError(e)
  }
}
