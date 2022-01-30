module.exports = {
  lintOnSave: true,
  pages: {
    index: {
      entry: "./src/renderer/main.js",
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/background/main.js",
      rendererProcessFile: "src/renderer/main.js",
      extraResources: ["src/background/db/"],
      externals: ["typeorm", "sqlite3"],
    },
  },
};
