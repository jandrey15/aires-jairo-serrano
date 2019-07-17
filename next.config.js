// module.exports = {}
// module.exports = {
//   target: 'serverless'
// }
const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/admin': { page: '/admin' },
      '/perfil': { page: '/perfil' },
      '/signup': { page: '/signup' }
    }
  },
  webpack (config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  }
}
