import sequelize from './db'
import * as Sequelize from 'sequelize'
// Somehow some unknown stupid loader will make the default export of './Announcement' to be undefined
import { TAnnouncement } from './Announcement'
// import Announcement from './Announcement'
// const Announcement: TAnnouncement = eval('require(\'./index\').models.Announcement.default')
import { fetchBanBlocks as _fetchBanBlocks } from '../ow-ban-list/build/helpers'


const BanBlock = sequelize.define('banBlock', {
  header: Sequelize.STRING,
  battleTags: Sequelize.ARRAY(Sequelize.STRING(32)),
  firstTag: {  // Works like a hash function to identify a block
    type: Sequelize.STRING(32),
    unique: true
  }
})

export default BanBlock as TBanBlock

type TBanBlock = typeof BanBlock & {
  id: number
  header: string
  battleTags: string
  firstTag: string
  annId: number
  createdAt: Date
  updatedAt: Date
  fetch(ann: TAnnouncement): Promise<TBanBlock[]>
}

export async function sync() {
  await BanBlock.sync({ force: true })  // Re-create table
}

/**
 * @description Fetch ban blocks for `ann` from web page.
 */
(BanBlock as TBanBlock).fetch = async function fetch(ann: TAnnouncement) {
  let blocks = await _fetchBanBlocks(ann)
  return await Promise.all(blocks.map(async block => {
    return await BanBlock.create({
      ...block,
      firstTag: block.battleTags[0],
      annId: ann.id
    } as any) as TBanBlock
  }))
  // return await sequelize.transaction()
  // .then(async t => {
  //   if(await BanBlock.count({ where: { annId: ann.id }, transaction: t })) throw Error('Announcement already has ban blocks')
  //   // Create new ban blocks
  //   // BulkCreate seem to be incompatible with transaction
  //   return (await BanBlock.bulkCreate(blocks.map(block => {
  //     return {
  //       ...block,
  //       annId: ann.id
  //     }
  //   }), { transaction: t })) as TBanBlock[]
  // })
}