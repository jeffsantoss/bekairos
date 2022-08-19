import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerServiceEntity, ReviewEntity, SpecialtyEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { PartnerResponse, PartnerServiceResponse } from '../get-by-specialty/usecase'

export interface LocalizationRequest {
  lat: string
  long: string
}

export const getAllPartners = async (request: LocalizationRequest): Promise<PartnerResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching all partners order by createdAt`)

  const partners = await dbConnection
    .getModelFor<PartnerEntity>(BeKairosModels.Partner)
    .find({}, { index: 'gs2', limit: 5 })

  let specialties: SpecialtyEntity[]
  let reviews: ReviewEntity[]
  let services: PartnerServiceEntity[]

  new Set(partners.map((p) => p.specialtyId)).forEach(async (specialtyId) => {
    const specialty = await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).get({ id: specialtyId })

    const reviews = await dbConnection
      .getModelFor<ReviewEntity>(BeKairosModels.Review)
      .find({ specialtyId }, { index: 'gs1', follow: true })

    const partnerServices = await dbConnection
      .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
      .find({ partnerId: reviews[0]?.partnerId }, { index: 'gs1', follow: true })

    specialties.push(specialty)
    reviews.concat(reviews)
    services.concat(partnerServices)
  })

  return partners.map((partner) => {
    const specialty = specialties.find((s) => s.id == partner.specialtyId)
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
    return <PartnerResponse>{
      id: partner?.id,
      name: partner?.name,
      address: partner.address,
      distance: distance?.m?.toFixed(0),
      services: services
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
      reviewAvg: average(reviews?.filter((r) => r.partnerId == partner.id)?.map((s) => s.score))
    }
  })
}
