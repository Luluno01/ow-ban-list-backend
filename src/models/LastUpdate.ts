import sequelize from './db'
import * as Sequelize from 'sequelize'


const LastUpdate = sequelize.define('LastUpdate', {
  announcementCount: Sequelize.INTEGER,
  errs: Sequelize.TEXT
})

export default LastUpdate as TLastUpdate

type TLastUpdate = typeof LastUpdate & {
  triggerUpdate(
    announcementCount: number,
    errs: { name: string, url: string, err: (Error | string) }[]
  ): Promise<void>
  getUpdate(): Promise<TLastUpdate>
}

export async function sync() {
  await LastUpdate.sync({ force: true })
  await LastUpdate.create({
    announcementCount: 0,
    errs: '[]'
  })
}

(LastUpdate as TLastUpdate).triggerUpdate = async (
  announcementCount: number,
  errs: { name: string, url: string, err: (Error | string) }[]
) => {
  errs = errs.map(err => {
    if(err.err instanceof Error) {
      err.err = err.err.stack || err.err.toString()
    }
    return err
  })
  let data = { announcementCount, errs: JSON.stringify(errs) }
  let [ update, created ] = await LastUpdate.findOrCreate({ where: { id: 1 }, defaults: data })
  if(!created) {
    await (update as typeof LastUpdate).update(data)
  }
}

(LastUpdate as TLastUpdate).getUpdate = async () => {
  return (await LastUpdate.findByPk(1)) as TLastUpdate
}