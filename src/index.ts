import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'
import * as _models from './models'


export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
  return {
    statusCode: 200,
    body: 'Thanks for using ow-ban-list'
  }
}

export const models = _models.models
export const sequelize = _models.sequelize