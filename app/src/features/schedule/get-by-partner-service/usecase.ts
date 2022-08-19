/* eslint-disable no-loops/no-loops */
import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerServiceEntity, ScheduleEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { dateWithoutTime } from '@common/utils/datetime'
import { PartnerResponse, PartnerServiceResponse } from '@features/partner/get-by-specialty/usecase'

interface ScheduleResponse {
  partner: PartnerResponse
  schedules: AttendanceResponse[]
}

interface AttendanceResponse {
  id: string
  start: number
  end: number
  interval: number
}

export interface GetScheduleByPartnerServiceRequest {
  serviceId: string
  date?: number
}

export const getScheduleByPartnerService = async (
  request: GetScheduleByPartnerServiceRequest
): Promise<AttendanceResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching service if exists`)

  const service = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: request.serviceId })

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id: service.partnerId })

  if (!service) throw new NotFoundError(request.serviceId)

  const schedules = await dbConnection
    .getModelFor<ScheduleEntity>(BeKairosModels.Schedule)
    .find({ partnerServiceId: request.serviceId })

  const attendances: AttendanceResponse[] = []

  schedules.map((s) => {
    if (
      dateWithoutTime(s.start) == dateWithoutTime(request.date) ||
      dateWithoutTime(s.end) == dateWithoutTime(request.date)
    ) {
      attendances.push({
        id: s.id,
        end: s.end,
        start: s.start,
        interval: s.interval
      })
    }
  })

  const response: ScheduleResponse = {
    partner: {
      id: service.partnerId,
      name: partner.name,
      specialty: {
        id: partner.specialtyId,
        name: partner.specialtyId
      },
      services: Array(service).map(
        (s) =>
          <PartnerServiceResponse>{
            id: service.id,
            name: service.name,
            price: service.price,
            description: service.description
          }
      )
    },
    schedules: attendances
  }

  return response
}
