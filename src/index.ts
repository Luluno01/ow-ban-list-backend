import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'


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