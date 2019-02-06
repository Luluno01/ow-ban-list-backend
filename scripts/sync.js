const { models, sequelize } = require('../functions/index')


let proms = []
for(let modelName in models) {
  proms.push(models[modelName].sync())
  /*
  .then(() => console.log(`Model ${modelName} synchronized`))
  .catch(err => {
    console.error(`Model ${modelName} failed to synchronize`)
    process.exit(1)
  })*/
}
Promise.all(proms)
.then(_ => {
  console.log('Models synchronized')
  sequelize.close()
})
.catch(err => {
  console.error(`Synchronize failed: ${err.stack}`)
  sequelize.close()
})