const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 1234,
    open: true,
    hot: true,
    bonjour: false,
    liveReload: true,
    watchFiles: ["./*.html"],
    static: { directory: path.join(__dirname, "./"), watch: true },
    client: { overlay: true },
  },
};
