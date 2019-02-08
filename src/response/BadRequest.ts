import Response from './Response'


export class BadRequest extends Response {
  statusCode: number = 400
}

export default BadRequest