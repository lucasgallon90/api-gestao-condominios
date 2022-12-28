const movimentacao = require("../database/models/movimentacao.schema.js");

module.exports = class Movimentacao {
  static async list(filters) {
    return movimentacao.aggregate(filters);
  }

  static async get(filters) {
    return movimentacao.aggregate(filters);
  }

  static async getTotalCount(filters) {
    return movimentacao.countDocuments(filters);
  }

  static async getContasMesAno(filters) {
    return movimentacao.aggregate(filters);
  }

  static async create(data) {
    return movimentacao.create(data);
  }

  static async update({ filters, data }) {
    return movimentacao.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return movimentacao.findOneAndDelete({ _id, _idCondominio });
  }
};
