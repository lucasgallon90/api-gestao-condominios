const leitura = require("../database/models/leitura.schema.js");

module.exports = class Leitura {
  static async list(filters) {
    return leitura.aggregate(filters);
  }
  static async get(data) {
    return leitura.aggregate(data);
  }
  static async findUnique(filters) {
    return leitura.findOne(filters);
  }

  static async create(data) {
    return leitura.create(data);
  }

  static async update({ filters, data }) {
    return leitura.findOneAndUpdate(filters, data);
  }

  static async delete(filters) {
    return leitura.deleteOne(filters);
  }
};
