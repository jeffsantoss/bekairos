import { ConflictError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { OneError } from 'dynamodb-onetable'
import { v4 } from 'uuid'

interface CreateSpecialtyRequest {
  name: string
}

export const createSpecialty = async (request: CreateSpecialtyRequest): Promise<string> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Criando especialidade ${request.name}`)

  const id = v4()
  try {
    await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).create({
      id,
      name: request.name
    })
  } catch (e) {
    if (e.code == 'UniqueError') {
      throw new ConflictError(request.name)
    }
  }

  console.log(`Especialidade criado com sucesso!!`)

  return id
}
