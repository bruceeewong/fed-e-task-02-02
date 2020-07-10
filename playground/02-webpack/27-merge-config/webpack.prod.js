const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "production",
  plugins: [new CleanWebpackPlugin(), new CopyWebpackPlugin(["public"])],
});
