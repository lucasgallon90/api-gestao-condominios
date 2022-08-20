const mongoose = require("mongoose");
beforeAll(async () => {
    await mongoose.connect(process.env['MONGODB_URL']);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });