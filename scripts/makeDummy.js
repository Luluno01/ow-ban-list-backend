const fs = require('fs')
const dummies = [ 'mysql2', 'sqlite3', 'tedious', 'pg-native' ]


for(let dummy of dummies) {
  fs.writeFile(`./node_modules/${dummy}.js`, '', err => {
    if(err) process.exit(1)
  })
}