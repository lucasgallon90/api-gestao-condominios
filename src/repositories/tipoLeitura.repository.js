const tipoLeitura = require("../database/models/tipoLeitura.schema.js");

module.exports = class TipoLeitura {
  static async list({ filters, paginate }) {
    return tipoLeitura.find(filters, {}, paginate);
  }

  static async get(filters) {
    return tipoLeitura.findOne(filters);
  }

  static async getTotalCount(filters) {
    return tipoLeitura.countDocuments(filters);
  }

  static async create(data) {
    return tipoLeitura.create(data);
  }

  static async update({filters, data}) {
    return tipoLeitura.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return tipoLeitura.deleteOne({ _id, _idCondominio });
  }
};