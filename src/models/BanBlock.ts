import sequelize from './db'
import * as Sequelize from 'sequelize'
import { TAnnouncement } from './Announcement'
import { fetchBanBlocks as _fetchBanBlocks } from '../ow-ban-list/build/helpers'
import hash from '../helpers/hash'


const BanBlock = sequelize.define('banBlock', {
  header: Sequelize.STRING,
  battleTags: Sequelize.ARRAY(Sequelize.STRING(32)),
  hash: {  // To identify a block
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
  toJSON(): object
}

export async function sync() {
  await BanBlock.sync({ force: true })  // Re-create table
}

/**
 * @description Fetch ban blocks for `ann` from web page.
 */
(BanBlock as TBanBlock).fetch = async function fetch(ann: TAnnouncement) {
  let blocks: BanBlock[] = await _fetchBanBlocks(ann)
  return await sequelize.transaction()
  .then(async t => {
    let createdBlocks: TBanBlock[] = []
    await Promise.all(blocks.map(async block => {
      try {
        createdBlocks.push(await BanBlock.create({
          ...block,
          hash: hash(JSON.stringify(block.battleTags)),
          annId: ann.id
        } as any, { transaction: t }) as TBanBlock)
      } catch(err) {
        // pass
      }
    }))
    await t.commit()
    return createdBlocks
  })
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