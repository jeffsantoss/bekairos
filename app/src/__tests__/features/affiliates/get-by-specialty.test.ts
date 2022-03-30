import { specialtyFixture } from '@core-tests/db/db-fixture'
import { createRequestObject } from '@core-tests/utils/api-gateway-request-mock'
import { handler } from '@features/affiliate/get-by-specialty/controller'

describe('get by category controller', () => {
  test('should get all affiliates by specialty', async () => {
    const affiliates = await handler(
      createRequestObject(
        'GET',
        JSON.stringify({
          coordinates: {
            lat: '-27.4408035',
            long: '-48.3935988'
          }
        }),
        {},
        {
          categoryId: specialtyFixture[0].id
        }
      )
    )

    console.log(affiliates)

    expect(affiliates).toBeDefined()
  })
})
