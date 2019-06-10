const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  webpack (config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  }
}

/* const withSass = require('@zeit/next-sass');

module.exports = withTypescript(
  withSass({
    webpack(config, options) {
      // Further custom configuration here
      return config;
    }
  })
); */
