import { createRequestObject } from '@core-tests/utils/api-gateway-request-mock'
import { handler } from '@features/partner/get/controller'

describe('get all partners controller', () => {
  test('should get all partners', async () => {
    const partners = await handler(
      createRequestObject(
        'GET',
        JSON.stringify({
          lat: '-27.4408035',
          long: '-48.3935988'
        }),
        {}
      )
    )

    console.log(partners)

    expect(partners).toBeDefined()
  })
})
