const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    publicPath: "dist/",
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png$/,
        use: "file-loader",
      },
    ],
  },
};
