const ocorrencia = require("../database/models/ocorrencia.schema.js");

module.exports = class Ocorrencia {
  static async list(filters) {
    return await ocorrencia.aggregate(filters);
  }
  static async get(filters) {
    return await ocorrencia.aggregate(filters);
  }

  static async getTotal(filters) {
    return await ocorrencia.countDocuments(filters);
  }

  static async create(data) {
    return await ocorrencia.create(data);
  }

  static async update({ filters, data }) {
    return await ocorrencia.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return await ocorrencia.deleteOne({ _id, _idCondominio });
  }
};
