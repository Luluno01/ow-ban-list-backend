import * as Sequelize from 'sequelize'


export const sequelize = new Sequelize(process.env.DB_URL)

export default sequelize