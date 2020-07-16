const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

/** @type {import('webpack').Configuration} */
const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hotOnly: true,
    contentBase: 'public',
    overlay: {
      warnings: false,
      errors: true
    }
  }
}

module.exports = merge(commonConfig, devConfig)
