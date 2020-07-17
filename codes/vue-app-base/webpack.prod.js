const path = require('path')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/** @type {import('webpack').Configuration} */
const prodConfig = {
  mode: 'production',
  output: {
    filename: 'js/[name]-[contenthash:8].bundle.js'
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 默认按es module打包, 导致前端加载不出图片
            limit: 2 * 1024,
            name: 'assets/[name]-[contenthash:8].[ext]'
          }
        }
      },
      {
        test: /\.(ttf|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name]-[contenthash:8].[ext]'
          }
        }
      }
    ]
  },
  optimization: {
    usedExports: true, // Tree shaking 标记
    minimize: true, // Tree shaking 删除未引用的模块
    splitChunks: {
      chunks: 'all', // 公共模块拆分
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementUI: {
          name: 'chunk-elementui',
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          priority: 20
        },
        commons: {
          name: 'chunks-common',
          test: path.join(__dirname, 'src/components'),
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:8].bundle.css'
    })
  ]
}

module.exports = merge(commonConfig, prodConfig)
