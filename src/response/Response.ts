import {
  APIGatewayProxyResult
} from 'aws-lambda'


export interface Formatable {
  toJSON(): string
}

export class Response implements APIGatewayProxyResult {
  statusCode: number = 200
  headers?: {
    [header: string]: boolean | number | string
  } = {}
  multiValueHeaders?: {
    [header: string]: Array<boolean | number | string>;
  }
  body: string
  isBase64Encoded: boolean

  constructor(body: string | boolean | number | Formatable | object = '') {
    switch(typeof body) {
      case 'string': break;
      case 'undefined':
      case 'boolean':
      case 'number': {
        this.setHeader('Content-Type', 'text/plain;charset=utf-8')
        body = (new String(body)).toString(); break;
      }
      default: {
        if('toJSON' in body && typeof body.toJSON == 'function') {
          try {
            let json = body.toJSON()
            if(typeof json != 'string') throw new TypeError
            body = json
            this.setHeader('Content-Type', 'application/json;charset=utf-8')
            break
          } catch(err) {}
        }
        try {
          body = JSON.stringify(body)
          this.setHeader('Content-Type', 'application/json;charset=utf-8')
        } catch(err) {
          this.setHeader('Content-Type', 'text/plain;charset=utf-8')
          body = (new String(body)).toString()
        }
      }
    }
    this.body = body
  }

  setHeader(header: string, value: boolean | number | string) {
    this.headers[header] = value
    return this
  }

  setHeaders(headers: {
    [header: string]: boolean | number | string
  }) {
    this.headers = headers
    return this
  }
}

export default Response