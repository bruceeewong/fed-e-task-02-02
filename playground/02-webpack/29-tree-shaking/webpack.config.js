module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: false }]],
          },
        },
      },
    ],
  },
  optimization: {
    // 标记模块, 根据是否被使用的成员
    usedExports: true,
    // 清除被标记的模块,压缩输出结果
    // minimize: true,
    // 尽可能合并每一个模块到一个函数中
    // concatenateModules: true,
  },
};
