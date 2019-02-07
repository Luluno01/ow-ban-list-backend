if(process.env.DEBUG) {
  module.exports = {
    mode: 'development',
    devtool: 'source-map'
  }
} else {
  module.exports = {}
}