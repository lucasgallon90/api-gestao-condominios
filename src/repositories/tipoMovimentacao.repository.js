const tipoMovimentacao = require("../database/models/tipoMovimentacao.schema.js");

module.exports = class TipoMovimentacao {
  static async list({ filters, page, limit }) {
    let paginate = {};
    if (page && limit) {
      paginate = { skip: limit * (page - 1), limit };
    }
    return tipoMovimentacao.find(filters, {}, paginate);
  }
  static async get(filters) {
    return tipoMovimentacao.findOne(filters);
  }

  static async getIds(filters) {
    return tipoMovimentacao.find(filters, { _id: 1 });
  }

  static async create(data) {
    return tipoMovimentacao.create(data);
  }

  static async update({ filters, data }) {
    return tipoMovimentacao.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return tipoMovimentacao.deleteOne({ _id, _idCondominio });
  }
};
