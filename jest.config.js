const { resolve } = require("path");
module.exports = {
  globalSetup: resolve(__dirname, "./src/tests/config/globalSetup.js"),
  globalTeardown: resolve(__dirname, "./src/tests/config/globalTeardown.js"),
  setupFilesAfterEnv: [resolve(__dirname, "./jest.setup.js")],
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Relatório de testes - API Gestão de Condomínios"
    }]
  ]
};
