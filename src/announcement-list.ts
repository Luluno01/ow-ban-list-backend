import { APIGatewayProxyHandler } from 'aws-lambda'
import Announcement from './models/Announcement'
import LastUpdate from './models/LastUpdate'
import Redirect from './response/Redirect'


export const handler: APIGatewayProxyHandler = async function handler(event) {
  let anns: typeof Announcement[] = await Announcement.findAll() as typeof Announcement[]
  let update: typeof LastUpdate = await LastUpdate.getUpdate()
  if(await LastUpdate.needUpdate(update)) {
    console.log('Updating announcements index')
    try {
      let annCount = (await Announcement.updateIndex()).length
      console.log(`${annCount} new announcement(s) updated`)
    } catch(err) {
      console.error(`Cannot update announcements index: ${err.stack}`)
    }
    return new Redirect(event.path)
  }
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