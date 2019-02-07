import * as Sequelize from 'sequelize'


export const sequelize = new Sequelize(process.env.DB_URL, {
  pool: {
    max: 5,
    min: 0
  }
})

export default sequelize