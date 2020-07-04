const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    publicPath: "dist/",
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ["html-loader", "./markdown-loader"],
      },
    ],
  },
};
