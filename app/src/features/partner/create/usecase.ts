import { BadArgumentError, ConflictError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

interface CreatePartnerRequest {
  name: string
  specialtyId: string
  ownerId?: string
}
export const createPartner = async (request: CreatePartnerRequest): Promise<string> => {
  const dbConnection = await getBeKairosDBConnection()

  const specialty = await dbConnection
    .getModelFor<SpecialtyEntity>(BeKairosModels.Specialty)
    .get({ id: request.specialtyId })

  if (!specialty) throw new BadArgumentError('specialtyId', 'specialty_not_found')

  const getBySpecialty = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).find(
    {
      specialtyId: request.specialtyId
    },
    { index: 'gs1', follow: true }
  )

  const withSameName = getBySpecialty.filter(
    (g) => g.name.trim().toLowerCase() == request.name.trim().toLocaleLowerCase()
  )

  if (withSameName != null && withSameName.length > 0) {
    throw new ConflictError(withSameName[0].id)
  }

  console.log(`Criando parceiro para a especialidade ${request.specialtyId}`)

  const id = v4()

  //TODO colocar endereco, coordenadas e todos os campos
  await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).create({
    id,
    name: request.name,
    ownerId: request?.ownerId ?? v4(),
    specialtyId: request.specialtyId,
    createdAt: Date.now()
  })

  console.log(`Parceiro criado com sucesso!!`)

  return id
}
