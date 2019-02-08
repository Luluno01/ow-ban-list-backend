import { APIGatewayProxyHandler } from 'aws-lambda'
import Announcement from './models/Announcement'
import LastUpdate from './models/LastUpdate'


export const handler: APIGatewayProxyHandler = async function handler() {
  let anns: typeof Announcement[] = await Announcement.findAll() as typeof Announcement[]
  let update: typeof LastUpdate = await LastUpdate.getUpdate()
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      anns: anns.map(ann => {
        return {
          id: ann.id,
          name: ann.name,
          url: ann.url
        }
      }),
      updatedAt: update.updatedAt.getTime()
    })
  }
}