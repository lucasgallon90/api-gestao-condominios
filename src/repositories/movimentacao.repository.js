const movimentacao = require("../database/models/movimentacao.schema.js");

module.exports = class Movimentacao {
  static async list(filters) {
    return await movimentacao.aggregate(filters);
  }

  static async get(filters) {
    return await movimentacao.aggregate(filters);
  }

  static async getContasMesAno(filters) {
    return await movimentacao.aggregate(filters);
  }

  static async create(data) {
    return await movimentacao.create(data);
  }

  static async update({ filters, data }) {
    return await movimentacao.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return await movimentacao.findOneAndDelete({ _id, _idCondominio });
  }
};
