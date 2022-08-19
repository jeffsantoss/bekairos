/* eslint-disable no-loops/no-loops */
import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerServiceEntity, ScheduleEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '@common/constants'
import { dateTimeToString } from '@common/utils/datetime'
import { v4 } from 'uuid'

export interface ScheduleResponse {
  service: PartnerServiceResponse
  schedules: AttendanceResponse[]
}

interface AttendanceResponse {
  start: number
  end: number
}

interface PartnerServiceResponse {
  id: string
  name: string
}

export interface CreateScheduleRequest {
  serviceId: string
  startJourney: number
  endJourney: number
  intervals: IntervalRequest[]
  serviceDurationInMinutes: number
}

export interface IntervalRequest {
  start: number
  end: number
}
export const createSchedule = async (request: CreateScheduleRequest): Promise<ScheduleResponse> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching service if exists`)

  const service = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: request.serviceId })

  if (!service) throw new NotFoundError(request.serviceId)

  let currentDate = request.startJourney

  console.log(`Horário de inicio da jornada: ${moment(currentDate).format(DATE_TIME_FORMAT)}`)

  const response: ScheduleResponse = {
    service: {
      id: service.id,
      name: service.name
    },
    schedules: []
  }

  while (currentDate < request.endJourney) {
    request.intervals?.forEach((i) => {
      if (currentDate >= i?.start && currentDate <= i?.end) {
        currentDate = i.end
        return
      }
    })

    const end = moment(currentDate).add(request.serviceDurationInMinutes, 'minutes').valueOf()

    console.log(
      `Criando agenda para o parceiro ${service.partnerId} com horário ${dateTimeToString(
        currentDate
      )} até ${dateTimeToString(end)}`
    )

    await create(currentDate, end, request.serviceId, request.serviceDurationInMinutes)

    currentDate = end.valueOf()

    response.schedules.push({ start: currentDate, end: end })
  }

  return response
}

const create = async (start: number, end: number, partnerServiceId: string, interval: number) => {
  const dbConnection = await getBeKairosDBConnection()

  await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).create({
    id: v4(),
    start,
    end,
    partnerServiceId,
    interval
  })
}
