"use strict";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};
exports.connect = async () => {
  await mongoose.connect(process.env.MONGODB_URL, mongoOptions, function (err) {
    if (err) throw err;
  });
};



exports.close = async () => {
  mongoose.disconnect();
};
