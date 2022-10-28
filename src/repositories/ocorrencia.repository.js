const ocorrencia = require("../database/models/ocorrencia.schema.js");

module.exports = class Ocorrencia {
  static async list(filters) {
    return ocorrencia.aggregate(filters);
  }
  static async get(filters) {
    return ocorrencia.aggregate(filters);
  }

  static async getTotal(filters) {
    return ocorrencia.countDocuments(filters);
  }

  static async create(data) {
    return ocorrencia.create(data);
  }

  static async update({ filters, data }) {
    return ocorrencia.findOneAndUpdate(filters, data);
  }

  static async delete({ _id, _idCondominio }) {
    return ocorrencia.deleteOne({ _id, _idCondominio });
  }
};
