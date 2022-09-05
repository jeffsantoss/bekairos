import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { PartnerResponse, PartnerServiceResponse } from '@features/partner/get-by-specialty/usecase'
import { getBeKairosDBConnection } from '@infra/db/db'
import { SpecialtyEntity, ReviewEntity, PartnerServiceEntity, PartnerEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'

export const getPartnerById = async (id: string, lat?: string, long?: string): Promise<PartnerResponse> => {
  const dbConnection = await getBeKairosDBConnection()

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id })

  const specialties: SpecialtyEntity[] = []
  let reviewsList: ReviewEntity[] = []
  let servicesList: PartnerServiceEntity[] = []

  const specialtyId = partner.specialtyId

  console.log(`Finding specialty from ${specialtyId}`)

  try {
    const specialty = await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).get({ id: specialtyId })

    const reviews = await dbConnection
      .getModelFor<ReviewEntity>(BeKairosModels.Review)
      .find({ specialtyId }, { index: 'gs1', follow: true })

    const partnerServices = await dbConnection
      .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
      .find({ partnerId: partner.id }, { index: 'gs1', follow: true })

    specialties.push(specialty)
    reviewsList = reviews.concat(reviews)
    servicesList = servicesList.concat(partnerServices)
  } catch (e) {
    console.warn(e)
    return
  }

  const specialty = specialties?.find((s) => s.id == partner.specialtyId)
  let distance

  if (lat && long) {
    distance = calculateDistanceBetweenCoordinates(
      {
        latitude: partner.coordinates['latitude'] as number,
        longitude: partner.coordinates['longitude'] as number
      },
      {
        latitude: Number.parseFloat(lat),
        longitude: Number.parseFloat(long)
      }
    )
  }

  return <PartnerResponse>{
    id: partner?.id,
    name: partner?.name,
    address: partner.address,
    distance: distance?.m?.toFixed(0),
    services: servicesList
      .filter((s) => s.partnerId == partner.id)
      .map((s) => {
        return <PartnerServiceResponse>{
          id: s.id,
          name: s.name,
          price: s.price,
          description: s.description
        }
      }),
    specialty: {
      id: specialty.id,
      name: specialty.name
    },
    reviewAvg: average(reviewsList?.filter((r) => r.partnerId == partner.id)?.map((s) => s.score))
  }
}
