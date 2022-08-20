const { resolve } = require("path");
module.exports = {
  globalSetup: resolve(__dirname, "./src/tests/config/globalSetup.js"),
  globalTeardown: resolve(__dirname, "./src/tests/config/globalTeardown.js"),
  setupFilesAfterEnv: [resolve(__dirname, "./jest.setup.js")],
};
