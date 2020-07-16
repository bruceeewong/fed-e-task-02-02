const {merge} = require('webpack-merge')
const commonConfig = require('./webpack.common')

/** @type {import('webpack').Configuration} */
const devConfig ={
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  }
}

module.exports = merge(commonConfig, devConfig)