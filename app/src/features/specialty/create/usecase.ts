import { getBeKairosDBConnection } from '@infra/db/db'
import { SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

interface CreateSpecialtyRequest {
  name: string
}

export const createSpecialty = async (request: CreateSpecialtyRequest): Promise<string> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Criando especialidade ${request.name}`)

  const id = v4()

  await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).create({
    id,
    name: request.name
  })

  console.log(`Especialidade criado com sucesso!!`)

  return id
}
