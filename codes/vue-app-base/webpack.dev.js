const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import('webpack').Configuration} */
const devConfig = {
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Webpack For Vue'
    })
  ]
}

module.exports = merge(commonConfig, devConfig)
