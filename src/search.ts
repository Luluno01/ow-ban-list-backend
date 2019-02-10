import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import BanBlock from './models/BanBlock'
import OK from './response/OK'
import Param from './helpers/Param'
import BadRequest from './response/BadRequest'


export const handler: APIGatewayProxyHandler = async function handler(event: APIGatewayProxyEvent) {
  let param = new Param(event.queryStringParameters, event)
  try {
    param.require('tags', 'array')
    let keyWords: string[] = []
    for(let k of param.param.tags as any[]) {
      if(typeof k != 'string') {
        return new BadRequest('Invalid search keyword', event)
      } else if(k.length) keyWords.push(k)
    }
    if(keyWords.length == 0) return new BadRequest('Invalid search keyword', event)
    return new OK(await BanBlock.search(keyWords), event)
  } catch(err) {
    return param.errRes
  }
}