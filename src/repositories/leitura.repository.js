const leitura = require("../database/models/leitura.schema.js");

module.exports = class Leitura {
  static async list(filters) {
    return await leitura.aggregate(filters);
  }
  static async get(data) {
    return await leitura.aggregate(data);
  }

  static async create(data) {
    return await leitura.create(data);
  }

  static async update({filters, data}) {
    return await leitura.findOneAndUpdate(filters, data);
  }

  static async delete(filters) {
    await leitura.deleteOne(filters);
  }
};
