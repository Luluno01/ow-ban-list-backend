import { APIGatewayProxyHandler } from 'aws-lambda'
import sequelize from './models/db'


export const handler: APIGatewayProxyHandler = async function handler() {
  let err: Error
  try {
    await sequelize.authenticate()
  } catch(e) {
    err = e
  }
  return {
    statusCode: 200,
    body: err ? err.message : 'OK'
  }
}