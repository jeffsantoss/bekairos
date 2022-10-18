import { TicketStatus } from '@common/constants'
import jwtTokenPayloadSingleton from '@common/security/authorizer-resource-access'
import { getBeKairosDBConnection } from '@infra/db/db'
import { ScheduleEntity, TicketEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'

export const getFutureTickets = async (): Promise<TicketEntity[]> => {
  const dbConnection = await getBeKairosDBConnection()

  const tickets = await dbConnection
    .getModelFor<TicketEntity>(BeKairosModels.Ticket)
    .find({ userId: jwtTokenPayloadSingleton?.sub }, { index: 'gs1', follow: true })

  const openedTickets = tickets.filter((t) => t.status == TicketStatus.ON_HOLD || t.status == TicketStatus.SCHEDULED)

  const onlyFutures = await Promise.all(
    openedTickets.filter(async (t) => {
      const schedule = await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).get({ id: t.scheduleId })

      if (schedule.end >= Date.now()) {
        return t
      }
    })
  )

  return onlyFutures
}
