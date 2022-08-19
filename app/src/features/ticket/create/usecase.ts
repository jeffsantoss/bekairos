/* eslint-disable no-loops/no-loops */
import { ConflictError, NotFoundError } from '@common/errors/api-errors'
import jwtTokenPayloadSingleton from '@common/security/authorizer-resource-access'
import { getBeKairosDBConnection } from '@infra/db/db'
import { ScheduleEntity, TicketEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export const createTicket = async (scheduleId: string): Promise<string> => {
  console.log(`Searching if schedule exists`)

  const dbConnection = await getBeKairosDBConnection()

  const schedule = await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).get({ id: scheduleId })

  if (!schedule) throw new NotFoundError(scheduleId)

  const userId = jwtTokenPayloadSingleton.sub

  const ticketAlreadyCreated = await dbConnection.getModelFor<TicketEntity>(BeKairosModels.Schedule).get({
    scheduleId: schedule.id,
    userId
  })

  if (ticketAlreadyCreated) {
    throw new ConflictError()
  }

  const ticket = await dbConnection.getModelFor<TicketEntity>(BeKairosModels.Ticket).create({
    scheduleId: schedule.id,
    userId,
    id: v4()
  })

  console.log(`TIcket for user ${userId} was created successfully`)

  return ticket.id
}
