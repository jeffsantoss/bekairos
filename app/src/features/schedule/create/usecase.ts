/* eslint-disable no-loops/no-loops */
import { NotFoundError } from '@common/errors/api-errors'
import { getBeKairosDBConnection } from '@infra/db/db'
import { PartnerServiceEntity, ScheduleEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { CreateScheduleRequest } from '../request-models'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '@common/constants'
import { dateTimeToString } from '@common/utils/datetime'

export const createSchedule = async (request: CreateScheduleRequest): Promise<void> => {
  const dbConnection = await getBeKairosDBConnection()

  console.log(`Searching service if exists`)

  const service = await dbConnection
    .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
    .get({ id: request.serviceId })

  if (!service) throw new NotFoundError(request.serviceId)

  const currentDate = request.startJourney

  console.log(`Horário de inicio da jornada: ${moment(currentDate).format(DATE_TIME_FORMAT)}`)

  while (currentDate <= request.endJourney) {
    // if(currentDate >= )
    const end = moment(currentDate).add(request.serviceDurationInMinutes, 'minutes')

    console.log(
      `Criando agenda para o parceiro ${service.partnerId} com horário ${dateTimeToString(
        currentDate
      )} até ${dateTimeToString(end.valueOf())}`
    )

    await create(currentDate, end.unix(), request.serviceId)
  }
}

const create = async (start: number, end: number, partnerServiceId: string) => {
  const dbConnection = await getBeKairosDBConnection()

  await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).create({
    start,
    end,
    partnerServiceId
  })
}

/*

Inicio - 07:00
Fim - 17:00
Intervalo - 

Enquanto vai do inicio até o intervalo 

 */
