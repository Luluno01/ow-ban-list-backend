import sequelize from './db'
import * as Sequelize from 'sequelize'
import LastUpdate from './LastUpdate'
import { fetchAnnList } from '../ow-ban-list/build/helpers'
import BanBlock from './BanBlock'


const Announcement = sequelize.define('announcement', {
  name: Sequelize.STRING,
  url: {
    type: Sequelize.TEXT,
    unique: true
  }
})

export default Announcement as TAnnouncement

type TAnnouncement = typeof Announcement & {
  id: number
  name: string
  url: string
  bans?: BanBlock[]
  createdAt: Date
  updatedAt: Date
  createIndex(): Promise<TAnnouncement[]>
  prototype: {
    fetch(): Promise<void>
  }
}

export async function sync() {
  await Announcement.sync({ force: true })  // Re-create table
  let anns = await (Announcement as TAnnouncement).createIndex()  // Create announcements index
  // Pre-fetch ban blocks of the first announcement
  try {
    await BanBlock.fetchBanBlocks(anns[0])
    await LastUpdate.triggerUpdate(1, [])
  } catch(err) {
    console.error(`Failed to pre-fetch ban blocks of the first announcement: ${err.stack}`)
    await LastUpdate.triggerUpdate(0, [ { name: anns[0].name, url: anns[0].url, err } ])
  }
}

/**
 * @description Create announcements index.
 * Should be used only when synchronizing.
 */
(Announcement as TAnnouncement).createIndex = async () => {
  let annMetas = await fetchAnnList()
  let anns: TAnnouncement[] = (await Announcement.bulkCreate(annMetas)) as TAnnouncement[]
  return anns
}