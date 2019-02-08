import Response from './Response'


export class Redirect extends Response {
  statusCode: number = 302
  constructor(location: string = '') {
    super('')
    this.setHeader('Location', location)
  }
}

export default Redirect