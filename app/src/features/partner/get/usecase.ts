import { EntityStatus } from '@common/constants'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity } from '@infra/db/models/bekairos-models'
import { getPartnerById } from '@infra/db/repository/partner/get/get-by-id'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { PartnerResponse } from '../get-by-specialty/usecase'

export interface LocalizationRequest {
  lat: string
  long: string
}

export const getAllPartners = async (request: LocalizationRequest): Promise<PartnerResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching all partners order by createdAt`)

  const partners = await dbConnection
    .getModelFor<PartnerEntity>(BeKairosModels.Partner)
    .find({ status: EntityStatus.ACTIVE }, { index: 'gs2', limit: 5, follow: true })

  console.log(`Partners ${JSON.stringify(partners)}`)

  const response: PartnerResponse[] = []

  await Promise.all(
    partners.map(async (partner) => {
      response.push(await getPartnerById(partner, request?.lat, request?.long))
    })
  )

  return response
}
