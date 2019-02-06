import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'
import LastUpdate from './models/LastUpdate'


export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
  let update = await LastUpdate.getUpdate()
  return {
    statusCode: 200,
    body: `${update.createdAt.getTime()}`
  }
}