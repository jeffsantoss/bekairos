import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { IntervalRequest } from '../request-models'
import { createSchedule } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body)

    const intervals: IntervalRequest[] = body.intervals.map((i) => {
      i.start
      i.end
    })

    return ok(
      await createSchedule({
        startJourney: body.start_journey,
        endJourney: body.end_journey,
        intervals,
        serviceDurationInMinutes: body.service_duration,
        serviceId: body.service_id
      })
    )
  } catch (e) {
    return handleError(e)
  }
}
