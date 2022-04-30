import { BadArgumentError, ConflictError, NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerServiceEntity, SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export interface CreatePartnerServiceRequest {
  partnerId: string
  name: string
  price: string
  description?: string
}

export const createPartnerService = async (request: CreatePartnerServiceRequest): Promise<string> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`request: ${JSON.stringify(request)}`)

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id: request.partnerId })

  if (!partner) throw new NotFoundError('partnerId')

  const getByPartner = await dbConnection.getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService).find(
    {
      partnerId: request.partnerId
    },
    { index: 'gs1', follow: true }
  )

  const withSameName = getByPartner.filter(
    (g) => g.name.trim().toLowerCase() == request.name.trim().toLocaleLowerCase()
  )
  if (withSameName != null && withSameName.length > 0) {
    throw new ConflictError(withSameName[0].id)
  }

  console.log(`Criando servico para o parceiro ${partner.name}`)

  const id = v4()

  await dbConnection.getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService).create({
    id,
    name: request.name,
    price: Number(request.price),
    partnerId: request.partnerId,
    description: request.description
  })

  console.log(`Servico criado com sucesso!!`)

  return id
}
