import sequelize from './db'
import * as Sequelize from 'sequelize'
import LastUpdate from './LastUpdate'
import { fetchAnnList } from '../ow-ban-list/build/helpers'
import BanBlock from './BanBlock'
import TaskQueue from '../ow-ban-list/build/helpers/TaskQueue'
import retry from '../helpers/retry'


export const Announcement = sequelize.define('announcement', {
  name: Sequelize.STRING,
  url: {
    type: Sequelize.TEXT,
    unique: true
  }
})

BanBlock.belongsTo(Announcement, { as: 'ann' })

export default Announcement as TAnnouncement

export type TAnnouncement = typeof Announcement & {
  id: number
  name: string
  url: string
  createdAt: Date
  updatedAt: Date
  createIndex(): Promise<TAnnouncement[]>
  updateIndex(): Promise<TAnnouncement[]>
  prototype: {
    fetch(): Promise<typeof BanBlock[]>
    getBans(): Promise<typeof BanBlock[]>
  }
  fetch(): Promise<typeof BanBlock[]>
  getBans(): Promise<typeof BanBlock[]>
  toJSON(): object
}

export async function sync() {
  await Announcement.sync({ force: true })  // Re-create table
  let anns = await (Announcement as TAnnouncement).createIndex()  // Create announcements index
  await LastUpdate.setUpdate(anns.length, '')
  // Pre-fetch ban blocks
  try {
    let job = (new TaskQueue(anns.map(ann => {
      return retry(async function() {
        await BanBlock.fetch(ann)
        console.log(`Ban blocks for announcement (${ann.id}) fetched`)
      }, 5)
    }), 10))
    await job.start()
    let errIndex = Object.keys(job.errs)
    if(errIndex.length) {
      console.error(`Failed to fetch ban blocks for some announcement(s): ${errIndex.map(i => anns[i].id)}`)
      let err: Error | string = job.errs[errIndex[0]]
      console.error(`The first error is: ${err instanceof Error ? err.stack : err}`)
    }
  } catch(err) {
    console.error(`Failed to pre-fetch ban blocks: ${err.stack}`)
  }
}

/**
 * @description Create announcements index.
 * Should be used only when synchronizing.
 */
(Announcement as TAnnouncement).createIndex = async () => {
  let annMetas = await fetchAnnList()
  return (await Announcement.bulkCreate(annMetas, { returning: true })) as TAnnouncement[]
}

/**
 * @description Update announcements index.
 * @returns Newly inserted announcements.
 */
(Announcement as TAnnouncement).updateIndex = async () => {
  let annMetas = await fetchAnnList()
  // Determine which is new announcement
  let oldAnns = (await Announcement.findAll()) as TAnnouncement[]
  let oldUrls = oldAnns.map(ann => ann.url)
  let newAnnMetas: typeof annMetas = []
  for(let annMeta of annMetas) {
    if(!oldUrls.includes(annMeta.url)) newAnnMetas.push(annMeta)  // New announcement found
  }
  if(newAnnMetas.length == 0) {
    await LastUpdate.setUpdate(annMetas.length, '')
    return []
  }
  return await sequelize.transaction()
  .then(async t => {
    try {
      let anns = (await Announcement.bulkCreate(newAnnMetas, { returning: true, transaction: t })) as TAnnouncement[]
      await LastUpdate.setUpdate(anns.length, '', t)
      return anns
    } catch(err) {
      await LastUpdate.setUpdate(0, err, t)  // 0 announcement was updated
    } finally {
      await t.commit()
    }
  })
}

/**
 * @description Re-fetch ban blocks for this announcement.
 */
(Announcement as TAnnouncement).prototype.fetch = async function fetch() {
  return await BanBlock.fetch(this)
};

/**
 * @description Query ban blocks of this announcement from database.
 */
(Announcement as TAnnouncement).prototype.getBans = async function getBans() {
  return (await BanBlock.findAll({ where: { annId: this.id } })) as typeof BanBlock[]
}
