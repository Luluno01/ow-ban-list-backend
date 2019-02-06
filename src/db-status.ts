import sequelize from './models/db'


import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'


export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
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