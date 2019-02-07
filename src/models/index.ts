import * as LastUpdate from './LastUpdate'
import * as BanBlock from './BanBlock'
import * as Announcement from './Announcement'
import _sequelize from './db'


export const models = {
  LastUpdate,
  BanBlock,
  Announcement
}

export default models

export const sequelize = _sequelize