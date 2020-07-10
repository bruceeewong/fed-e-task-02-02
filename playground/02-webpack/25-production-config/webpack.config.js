module.exports = (env, argv) => {
  const config = {};
  if (env === "production") {
    config.mode = "production";
    config.devtool = false;
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(["public"]),
    ];
  }
  return config;
};
