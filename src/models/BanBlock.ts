import sequelize from './db'
import * as Sequelize from 'sequelize'
import Announcement from './Announcement'
import { fetchBanBlocks as _fetchBanBlocks } from '../ow-ban-list/build/helpers'


const BanBlock = sequelize.define('banBlock', {
  header: Sequelize.STRING,
  battleTags: Sequelize.ARRAY(Sequelize.STRING(32))
})

BanBlock.belongsTo(Announcement, { as: 'ann' })

export default BanBlock as TBanBlock

type TBanBlock = typeof BanBlock & {
  id: number
  header: string
  battleTags: string
  annId: number
  createdAt: Date
  updatedAt: Date
  fetch(ann: typeof Announcement): Promise<TBanBlock[]>
}

export async function sync() {
  await BanBlock.sync({ force: true })  // Re-create table
}

/**
 * @description Fetch ban blocks for `ann` from web page.
 * Throws an error and rollback if `ann` already has ban blocks.
 */
(BanBlock as TBanBlock).fetch = async function fetch(ann: typeof Announcement) {
  let blocks = await _fetchBanBlocks(ann)
  return await sequelize.transaction()
  .then(async t => {
    if(await BanBlock.count({ where: { annId: ann.id }, transaction: t })) throw Error('Announcement already has ban blocks')
    // Create new ban blocks
    return (await BanBlock.bulkCreate(blocks.map(block => {
      return {
        ...block,
        annId: ann.id
      }
    }), { transaction: t })) as TBanBlock[]
  })
}