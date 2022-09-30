const tipoLeitura = require("../database/models/tipoLeitura.schema.js");

module.exports = class TipoLeitura {
  static async list({ filters, paginate }) {
    return await tipoLeitura.find(filters, {}, paginate);
  }
  static async get(filters) {
    return await tipoLeitura.findOne(filters);
  }

  static async create(data) {
    return await tipoLeitura.create(data);
  }

  static async update({filters, data}) {
    return await tipoLeitura.findOneAndUpdate(filters, data);
  }

  static async delete(data) {
    return await tipoLeitura.deleteOne(data);
  }
};
