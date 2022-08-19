import { handleError } from '@common/errors/handle-error'
import { ok } from '@common/responses/responses'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createSchedule, IntervalRequest } from './usecase'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body)

    const intervals = body?.intervals?.map(
      (i) =>
        <IntervalRequest>{
          start: i.start,
          end: i.end
        }
    )

    return ok(
      await createSchedule({
        startJourney: body.startJourney,
        endJourney: body.endJourney,
        intervals,
        serviceDurationInMinutes: body.serviceDurationInMinutes,
        serviceId: body.serviceId
      })
    )
  } catch (e) {
    return handleError(e)
  }
}
