module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 1234,
    open: true,
    hot: false,
    liveReload: true,
    watchFiles: ["./*.html"],
    static: { directory: "./", watch: true },
  },
};
