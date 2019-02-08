import { APIGatewayProxyHandler } from 'aws-lambda'
import LastUpdate from './models/LastUpdate'


export const handler: APIGatewayProxyHandler = async function handler() {
  let update = await LastUpdate.getUpdate()
  return {
    statusCode: 200,
    body: `${update.createdAt.getTime()}`
  }
}