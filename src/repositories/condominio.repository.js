const condominio = require("../database/models/condominio.schema.js");

module.exports = class Condominio {
  static async list({ filters, paginate }) {
    return condominio.find(filters, {}, paginate);
  }
  static async getById(_id) {
    return condominio.findById({ _id });
  }

  static async getByCodigo(codigo) {
    return condominio.findOne({ codigo }, { _id: 1, nome: 1, codigo: 1 });
  }

  static async getTotal() {
    return condominio.countDocuments();
  }

  static async create(data) {
    const condominioCreate = { ...data };
    return condominio.create(condominioCreate);
  }

  static async update(data) {
    const { _id, ...rest } = data;
    return condominio.findOneAndUpdate({ _id }, rest);
  }

  static async delete(_id) {
    return condominio.findOneAndDelete({ _id });
  }
};
