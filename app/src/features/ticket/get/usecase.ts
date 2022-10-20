import { TicketStatus } from '@common/constants'
import authDataSingleton from '@common/security/authorizer-resource-access'
import { PartnerResponse, PartnerServiceResponse } from '@features/partner/get-by-specialty/usecase'
import { getBeKairosDBConnection } from '@infra/db/db'
import {
  PartnerEntity,
  PartnerMemberEntity,
  PartnerServiceEntity,
  ScheduleEntity,
  TicketEntity
} from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'

interface TicketResponse {
  partner: PartnerResponse
  schedule: AttendanceResponse
}

interface AttendanceResponse {
  start: number
  end: number
  interval: number
}

export const getFutureTickets = async (): Promise<TicketEntity[]> => {
  const dbConnection = await getBeKairosDBConnection()

  const tickets = await dbConnection
    .getModelFor<TicketEntity>(BeKairosModels.Ticket)
    .find({ userId: authDataSingleton?.jwtPayload.sub }, { index: 'gs1', follow: true })

  const openedTickets = tickets.filter((t) => t.status == TicketStatus.ON_HOLD || t.status == TicketStatus.SCHEDULED)

  const onlyFutures = await Promise.all(
    openedTickets.filter(async (t) => {
      const schedule = await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).get({ id: t.scheduleId })

      if (schedule.end >= Date.now()) {
        const service = await dbConnection
          .getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService)
          .get({ id: schedule.partnerServiceId })

        const partner = await dbConnection
          .getModelFor<PartnerEntity>(BeKairosModels.Partner)
          .get({ id: service.partnerId })

        const member = await dbConnection
          .getModelFor<PartnerMemberEntity>(BeKairosModels.PartnerMember)
          .get({ partnerServiceId: service.id }, { index: 'gs1', follow: true })

        return <TicketResponse>{
          partner: {
            id: partner.id,
            name: partner.name,
            services: Array(service).map(
              (s) =>
                <PartnerServiceResponse>{
                  id: service.id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                  professional: {
                    id: member.id,
                    name: member.name
                  }
                }
            )
          },
          schedule: {
            start: schedule.start,
            end: schedule.end,
            interval: schedule.interval
          }
        }
      }
    })
  )

  return onlyFutures
}
