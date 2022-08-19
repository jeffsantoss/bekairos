import { getBeKairosDBConnection } from '@infra/db/db'
import { SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'

interface SpecialtyResponse {
  id: string
  name: string
  description: string
}

export const getAllSpecialties = async (): Promise<SpecialtyResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  const entities = await dbConnection
    .getModelFor<SpecialtyEntity>(BeKairosModels.Specialty)
    .find({}, { index: 'gs1', follow: true })

  return entities.map(
    (e) =>
      <SpecialtyResponse>{
        id: e.id,
        name: e.name,
        description: e.description
      }
  )
}
