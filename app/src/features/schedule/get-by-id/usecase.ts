/* eslint-disable no-loops/no-loops */
import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerEntity, PartnerServiceEntity, ScheduleEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { PartnerResponse, PartnerServiceResponse } from '@features/partner/get-by-specialty/usecase'

interface ScheduleResponse {
  partner: PartnerResponse
  schedule: AttendanceResponse
}

interface AttendanceResponse {
  start: number
  end: number
  interval: number
}

export interface GetScheduleByPartnerServiceRequest {
  serviceId: string
  date?: number
}

export const getScheduleById = async (scheduleId: string): Promise<ScheduleResponse> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching schedule ${scheduleId} if exists`)

  const schedule = await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).get({ id: scheduleId })

  if (!schedule) throw new NotFoundError(scheduleId)

  const service = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: schedule.partnerServiceId })

  const partner = await dbConnection.getModelFor<PartnerEntity>(BeKairosModels.Partner).get({ id: service.partnerId })

  const response: ScheduleResponse = {
    partner: {
      id: partner.id,
      name: partner.name,
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
    schedule: {
      start: schedule.start,
      end: schedule.end,
      interval: schedule.interval
    }
  }

  return response
}
