const { MongoMemoryServer } = require('mongodb-memory-server');
const {config} = require("./config");

 async function globalTeardown() {
  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    const instance= global.__MONGOINSTANCE;
    await instance.stop();
  }
};
module.exports = globalTeardown;