const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./public",
    proxy: {
      "/api": {
        target: "https://api.github.com", // http://localhost:8080/api/* -> https://api.github.com/api/*
        pathRewrite: {
          "^/api": "", // http://localhost:8080/api/* -> https://api.github.com/*
        },
        // 默认的主机名是 localhost:8080 -> api.github.com
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: "Webpack devServer Demo",
      template: "public/index.html",
    }),
  ],
};
