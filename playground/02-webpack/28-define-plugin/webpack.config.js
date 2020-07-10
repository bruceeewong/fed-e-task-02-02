const webpack = require("webpack");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      API_BASE_URL: '"http://api.example.com"',
    }),
  ],
};
