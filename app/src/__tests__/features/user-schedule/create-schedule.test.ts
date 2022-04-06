import { DATE_TIME_FORMAT } from '@common/constants'
import { stringDateTimeToTimestamp } from '@common/utils/datetime'
import { PARTNER_SERVICE_FIXTURE, specialtyFixture } from '@core-tests/db/db-fixture'
import { createRequestObject } from '@core-tests/utils/api-gateway-request-mock'
import { handler } from '@features/schedule/create/controller'
import { CreateScheduleRequest } from '@features/schedule/request-models'
import moment from 'moment'

describe('create schedule controller', () => {
  test('should create succesfully', async () => {
    const body: CreateScheduleRequest = {
      startJourney: stringDateTimeToTimestamp('05/04/2022 09:00'),
      endJourney: stringDateTimeToTimestamp('05/04/2022 17:00'),
      serviceDurationInMinutes: 15 * 60,
      serviceId: PARTNER_SERVICE_FIXTURE.id,
      intervals: [
        {
          start: stringDateTimeToTimestamp('05/04/2022 12:00'),
          end: stringDateTimeToTimestamp('05/04/2022 13:30')
        }
      ]
    }

    await handler(createRequestObject('GET', JSON.stringify(body), {}))
  })
})
