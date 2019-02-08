import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import BanBlock from './models/BanBlock'
import OK from './response/OK'
import Param from './helpers/Param'
import Announcement, { TAnnouncement } from './models/Announcement'
import BadRequest from './response/BadRequest'


export const handler: APIGatewayProxyHandler = async function handler(event: APIGatewayProxyEvent) {
  let param = new Param(event.queryStringParameters)
  try {
    param
    .require('ann', 'int')
    .require('index', 'int')
  } catch(err) {
    return param.errRes
  }
  let annId = param.param.ann as number
  let banIndex = param.param.index as number
  const query = {
    where: {
      annId
    },
    offset: banIndex,
    limit: 1
  }
  console.log(`Querying ban blocks for announcement (${annId})`)
  let { rows, count } = (await BanBlock.findAndCountAll(query)) as { rows: typeof BanBlock[], count :number }
  if(!count) {
    // Need to fetch
    // Find the announcement first
    let ann = await Announcement.findByPk(annId) as TAnnouncement
    if(ann) {
      console.log(`Fetching ban blocks for announcement (${annId})`)
      try {
        await ann.fetch()  // Trigger fetch
      } catch(err) {}
      // Re-fetch ban blocks
      console.log(`Re-querying ban blocks for announcement (${annId})`)
      let { rows, count } = (await BanBlock.findAndCountAll(query)) as { rows: typeof BanBlock[], count :number }
      console.log(`${count} ban blocks found for announcement (${annId}) after fetching`)
      return new OK({
        ban: rows[0] ? rows[0].toJSON() : null,
        count
      })
    } else {
      return new BadRequest('No such announcement')
    }
  } else {
    console.log(`${count} ban blocks found for announcement (${annId})`)
    return new OK({
      ban: rows[0] ? rows[0].toJSON() : null,
      count
    })
  }
}