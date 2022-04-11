/* eslint-disable no-loops/no-loops */
import { ConflictError, NotFoundError } from '@common/errors/api-errors'
import jwtTokenPayloadSingleton from '@common/security/authorizer-resource-access'
import { getBeKairosDBConnection } from '@infra/db/db'
import { ScheduleEntity, SchedulingEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export const createScheduling = async (scheduleId: string): Promise<string> => {
  console.log(`Searching if schedule exists`)

  const dbConnection = await getBeKairosDBConnection()

  const schedule = await dbConnection.getModelFor<ScheduleEntity>(BeKairosModels.Schedule).get({ id: scheduleId })

  if (!schedule) throw new NotFoundError(scheduleId)

  const userId = jwtTokenPayloadSingleton.sub

  const schedulingAlreadyCreated = await dbConnection.getModelFor<SchedulingEntity>(BeKairosModels.Schedule).get({
    scheduleId: schedule.id,
    userId
  })

  if (schedulingAlreadyCreated) {
    throw new ConflictError()
  }

  const scheduling = await dbConnection.getModelFor<SchedulingEntity>(BeKairosModels.Schedule).create({
    scheduleId: schedule.id,
    userId,
    id: v4()
  })

  console.log(`Scheduling for user ${userId} was created successfully`)

  return scheduling.id
}
