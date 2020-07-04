const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

class MyPlugin {
  apply(compiler) {
    console.log("my-plugin launch");

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      for (const name in compilation.assets) {
        // console.log(name); // 文件名
        // console.log(compilation.assets[name].source()); // 文件内容
        // console.log(compilation.assets[name].size()); // 文件内容大小
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g, ""); // 删除注释
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Webpack HTML Plugin",
      template: "public/index.html",
      meta: {
        viewport: "width=device-width",
      },
    }),
    // new HtmlWebpackPlugin({
    //   filename: "about.html",
    // }),
    new CopyWebpackPlugin({
      patterns: ["public"],
    }),
    new MyPlugin(),
  ],
};
