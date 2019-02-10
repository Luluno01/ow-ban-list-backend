import { APIGatewayProxyHandler } from 'aws-lambda'
import * as _models from './models'


export const handler: APIGatewayProxyHandler = async function handler() {
  return {
    statusCode: 200,
    body: `Thanks for using ow-ban-list`
  }
}

export const models = _models.models
export const sequelize = _models.sequelize