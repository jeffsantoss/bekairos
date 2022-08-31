import { handleError } from '@common/errors/handle-error'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    //await authorizeResourceAccess(event)
    // return ok(await getfutu(scheduleId))

    console.log('ToDo Implementation')
  } catch (e) {
    return handleError(e)
  }
}
