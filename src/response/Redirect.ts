import { APIGatewayProxyEvent } from 'aws-lambda'
import Response from './Response'


export class Redirect extends Response {
  statusCode: number = 302
  constructor(location: string = '', event: APIGatewayProxyEvent) {
    super('', event)
    this.setHeader('Location', location)
  }
}

export default Redirect