import { dateWithoutTime } from '@common/utils/datetime'
import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { AttendanceResponse } from '@features/partner-service/get-schedules/usecase'
import { PartnerResponse, PartnerServiceResponse } from '@features/partner/get-by-specialty/usecase'
import { ScheduleResponse } from '@features/schedule/create/usecase'
import { getBeKairosDBConnection } from '@infra/db/db'
import {
  SpecialtyEntity,
  ReviewEntity,
  PartnerServiceEntity,
  PartnerEntity,
  ScheduleEntity
} from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { request } from 'http'

export const getPartnerById = async (id: string, lat?: string, long?: string): Promise<PartnerResponse> => {
  const dbConnection = await getBeKairosDBConnection()

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id })

  const specialties: SpecialtyEntity[] = []
  const reviews: ReviewEntity[] = []
  const services: PartnerServiceEntity[] = []

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
    reviews.concat(reviews)
    services.concat(partnerServices)
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
}
