const { models, sequelize } = require('../functions/index');


(async function() {
  for(let modelName in models) {
    try {
      await models[modelName].sync()
      console.log(`Model ${modelName} synchronized`)
    } catch(err) {
      console.error(`Model ${modelName} failed to synchronize: ${err.stack}`)
      process.exit(1)
    }
  }
  sequelize.close()
  process.exit(0)
})()