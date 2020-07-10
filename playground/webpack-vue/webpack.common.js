const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * jsdoc 与 typescript import 的结合
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/bundle.[contenthash:6].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "img/[name].[contenthash:6].[ext]",
            esModule: false, // url-loader默认按照es module打包
            limit: 5 * 1024, // 在范围内, 转为base64; 超过限制, 使用file-loader提取文件
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Vue App Sample",
    }),
    new VueLoaderPlugin(), // 将rules应用到vue单文件中,
    new webpack.DefinePlugin({
      BASE_URL: '"/"',
    }),
  ],
};
