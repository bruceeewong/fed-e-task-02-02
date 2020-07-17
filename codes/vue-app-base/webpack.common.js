const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  // 入口定义
  entry: './src/main.js',
  // 输出定义
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src') // 全局名称
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all' // 公共模块拆分
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      BASE_URL: '"/"' // 导出的是js字面量
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Webpack For Vue'
    })
  ]
}
