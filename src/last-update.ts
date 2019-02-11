import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda'
import LastUpdate from './models/LastUpdate'
import OK from './response/OK'


export const handler: APIGatewayProxyHandler = async function handler(event: APIGatewayProxyEvent) {
  let update = await LastUpdate.getUpdate()
  return new OK(update.date.getTime(), event)
}