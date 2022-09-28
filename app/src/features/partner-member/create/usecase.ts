import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerMemberEntity, PartnerServiceEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export interface CreatePartnerMemberRequest {
  partnerServiceId: string
  name: string
}

export const createPartnerMember = async (request: CreatePartnerMemberRequest): Promise<string> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`request: ${JSON.stringify(request)}`)

  const partnerService = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: request.partnerServiceId })

  if (!partnerService) throw new NotFoundError('partnerServiceId')

  console.log(`Criando profissional para o serviço ${partnerService.name}`)

  const id = v4()

  //userId should change to id of token
  await dbConnection.getModelFor<PartnerMemberEntity>(BeKairosModels.PartnerMember).create({
    id,
    name: request.name,
    userId: v4(),
    partnerServiceId: partnerService.id,
    partnerId: partnerService.partnerId
  })

  console.log(`Profissional ${request.name} criado com sucesso!!`)

  return id
}
