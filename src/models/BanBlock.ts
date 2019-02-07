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
  fetchBanBlocks(ann: typeof Announcement): Promise<TBanBlock[]>
}

export async function sync() {
  await BanBlock.sync({ force: true })  // Re-create table
}

/**
 * @description Fetch and override ban blocks for this instance.
 * Instance will NOT be saved automatically.
 */
(BanBlock as TBanBlock).fetchBanBlocks = async function fetchBanBlocks(ann: typeof Announcement) {
  let blocks = await _fetchBanBlocks(ann)
  return (await BanBlock.bulkCreate(blocks.map(block => {
    return {
      ...block,
      annId: ann.id
    }
  }))) as TBanBlock[]
}