/* eslint-disable no-loops/no-loops */
import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerServiceEntity, ScheduleEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { dateWithoutTime } from '@common/utils/datetime'

interface AttendanceResponse {
  start: number
  end: number
  interval: number
}

export interface GetScheduleByPartnerServiceRequest {
  serviceId: string
  date?: number
}

export const getScheduleById = async (scheduleId: string): Promise<AttendanceResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching service if exists`)

  const service = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: request.serviceId })

  if (!service) throw new NotFoundError(request.serviceId)

  const schedules = await dbConnection
    .getModelFor<ScheduleEntity>(BeKairosModels.Schedule)
    .find({ partnerServiceId: request.serviceId })

  const response: AttendanceResponse[] = []

  schedules.map((s) => {
    if (
      dateWithoutTime(s.start) == dateWithoutTime(request.date) ||
      dateWithoutTime(s.end) == dateWithoutTime(request.date)
    ) {
      response.push({
        end: s.end,
        start: s.start,
        interval: s.interval
      })
    }
  })

  return response
}
