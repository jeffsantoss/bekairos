import { BadArgumentError } from '@common/errors/api-errors'
import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, SpecialtyEntity, ReviewEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'

interface GetAffiliatesBySpecialty {
  lat: string
  long: string
}

export interface PartnerResponse {
  id: string
  name: string
  address?: any
  reviewAvg?: number
  distance?: string
  specialty: SpecialtyResponse
  services: PartnerServiceResponse[]
}

export interface SpecialtyResponse {
  id: string
  name: string
}

export interface PartnerServiceResponse {
  id: string
  name: string
  price: number
  description?: string
}

export const getBySpecialty = async (
  specialtyId: string,
  request: GetAffiliatesBySpecialty
): Promise<PartnerResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  if (!specialtyId) throw new BadArgumentError('specialtyId')

  console.log(`Searching affiliates from category ${specialtyId}`)

  const specialty = await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).get({ id: specialtyId })

  const partners = await dbConnection
    .getModelFor<PartnerEntity>(BeKairosModels.Partner)
    .find({ specialtyId }, { index: 'gs1', follow: true })

  const reviews = await dbConnection
    .getModelFor<ReviewEntity>(BeKairosModels.Review)
    .find({ specialtyId }, { index: 'gs1', follow: true })

  return partners.map((partner) => {
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
      specialty: {
        id: specialty.id,
        name: specialty.name
      },
      reviewAvg: average(reviews?.filter((r) => r.partnerId == partner.id)?.map((s) => s.score))
    }
  })
}
