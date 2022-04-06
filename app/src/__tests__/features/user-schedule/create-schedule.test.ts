import { createRequestObject } from '@core-tests/utils/api-gateway-request-mock'
import { handler } from '@features/schedule/create/controller'
import { CreateScheduleRequest } from '@features/schedule/request-models'

describe('create schedule controller', () => {
  test('should create succesfully', async () => {
    const request: CreateScheduleRequest = {
      intervals: [
        start: moment('')
      ]
    }
    await handler(
      createRequestObject(
        'GET',
        JSON.stringify({
          intervals: []
        }),
        {}
      )
    )

    console.log(affiliates)

    expect(affiliates).toBeDefined()
  })
})
