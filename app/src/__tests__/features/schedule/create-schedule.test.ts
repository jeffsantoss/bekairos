// import { stringDateTimeToTimestamp } from '@common/utils/datetime'
// import { PARTNER_SERVICE_FIXTURE } from '@core-tests/db/db-fixture'
// import { createRequestObject } from '@core-tests/utils/api-gateway-request-mock'
// import { handler } from '@features/schedule/create/controller'

// describe('create schedule controller', () => {
//   test('should create succesfully when has only one interval', async () => {
//     const body: CreateScheduleRequest = {
//       startJourney: stringDateTimeToTimestamp('05/04/2022 09:00'),
//       endJourney: stringDateTimeToTimestamp('05/04/2022 17:00'),
//       serviceDurationInMinutes: 30,
//       serviceId: PARTNER_SERVICE_FIXTURE.id,
//       intervals: [
//         {
//           start: stringDateTimeToTimestamp('05/04/2022 12:00'),
//           end: stringDateTimeToTimestamp('05/04/2022 13:30')
//         }
//       ]
//     }

//     const result = await handler(createRequestObject('GET', JSON.stringify(body), {}))

//     const bodyResponse: ScheduleResponse = JSON.parse(result.body)

//     /*
//       09:00~09:30|09:30~10:00|10:00~10:30|10:30~11:00|11:00~11:30|11:30~12:00|13:30~14:00|14:00~14:30|14:30~15:00|15:00~15:30|15:30~16:00|16:00~16:30|16:30~17:00
//     */
//     expect(bodyResponse.schedules.length).toBe(13)
//   })

//   test('should create succesfully when has more one interval', async () => {
//     const body: CreateScheduleRequest = {
//       startJourney: stringDateTimeToTimestamp('05/04/2022 09:00'),
//       endJourney: stringDateTimeToTimestamp('05/04/2022 17:00'),
//       serviceDurationInMinutes: 30,
//       serviceId: PARTNER_SERVICE_FIXTURE.id,
//       intervals: [
//         {
//           start: stringDateTimeToTimestamp('05/04/2022 12:00'),
//           end: stringDateTimeToTimestamp('05/04/2022 13:30')
//         },
//         {
//           start: stringDateTimeToTimestamp('05/04/2022 15:00'),
//           end: stringDateTimeToTimestamp('05/04/2022 15:30')
//         }
//       ]
//     }

//     const result = await handler(createRequestObject('GET', JSON.stringify(body), {}))

//     const bodyResponse: ScheduleResponse = JSON.parse(result.body)

//     /*
//       09:00~09:30|09:30~10:00|10:00~10:30|10:30~11:00|11:00~11:30|11:30~12:00|13:30~14:00|14:00~14:30|14:30~15:00|15:30~16:00|16:00~16:30|16:30~17:00
//     */
//     expect(bodyResponse.schedules.length).toBe(12)
//   })
// })
