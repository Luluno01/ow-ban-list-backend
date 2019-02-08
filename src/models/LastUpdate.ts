import sequelize from './db'
import * as Sequelize from 'sequelize'
import { formatError } from '../helpers/formatError'


/**
 * @description Tht only instance of LastUpdate is used to mark the last update of announcement index.
 */
const LastUpdate = sequelize.define('lastUpdate', {
  announcementCount: Sequelize.INTEGER,
  err: Sequelize.TEXT,
  date: Sequelize.DATE
})

export default LastUpdate as TLastUpdate

type TLastUpdate = typeof LastUpdate & {
  id: number
  /**
   * @description The number of announcements whose ban blocks are successfully fetched.
   */
  announcementCount: number
  err: string
  createdAt: Date
  updatedAt: Date
  date: Date
  setUpdate(
    announcementCount: number,
    err: Error | string
  ): Promise<void>
  getUpdate(): Promise<TLastUpdate>
  toJSON(): object
}

export async function sync() {
  await LastUpdate.sync({ force: true })
  await LastUpdate.create({
    announcementCount: 0,
    err: '',
    date: new Date
  })
}

(LastUpdate as TLastUpdate).setUpdate = async (
  announcementCount: number,
  err: Error | string
) => {
  err = formatError(err)
  let data = { announcementCount, err, date: new Date }
  let [ update, created ] = await LastUpdate.findOrCreate({ where: { id: 1 }, defaults: data })
  if(!created) {
    for(let key in data) {
      (update as Sequelize.Instance<TLastUpdate>).set(key, data[key])
    }
    await (update as Sequelize.Instance<TLastUpdate>).save()
  }
}

(LastUpdate as TLastUpdate).getUpdate = async () => {
  return (await LastUpdate.findByPk(1)) as TLastUpdate
}