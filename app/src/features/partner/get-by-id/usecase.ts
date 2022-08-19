import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerServiceEntity, ReviewEntity, SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { PartnerResponse, PartnerServiceResponse } from '../get-by-specialty/usecase'
import { LocalizationRequest } from '../get/usecase'

export const getPartnerById = async (id: string, request: LocalizationRequest): Promise<PartnerResponse> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching all partners order by createdAt`)

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id })
  const specialty = await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).get({ id: partner.id })
  const reviews = await dbConnection
    .getModelFor<ReviewEntity>(BeKairosModels.Review)
    .find({ specialtyId: partner.specialtyId }, { index: 'gs1', follow: true })
  const partnerServices = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .find({ partnerId: partner.id }, { index: 'gs1', follow: true })

  let distance

  if (request.lat && request.long) {
    distance = calculateDistanceBetweenCoordinates(
      {
        latitude: partner.coordinates['latitude'] as number,
        longitude: partner.coordinates['longitude'] as number
      },
      {
        latitude: Number.parseFloat(request.lat),
        longitude: Number.parseFloat(request.long)
      }
    )
  }

  const services: PartnerServiceResponse[] = partnerServices.map((ps) => {
    return <PartnerServiceResponse>{
      id: ps.id,
      name: ps.name,
      price: ps.price,
      description: ps.description
    }
  })

  return <PartnerResponse>{
    id: partner?.id,
    name: partner?.name,
    address: partner.address,
    distance: distance?.m?.toFixed(0),
    specialty: {
      id: specialty.id,
      name: specialty.name
    },
    services,
    reviewAvg: average(reviews?.filter((r) => r.partnerId == partner.id)?.map((s) => s.score))
  }
}
