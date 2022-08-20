const condominio = require("../database/models/condominio.schema.js");

module.exports = class Condominio {
  static async list({ filters, paginate}) {
   
    return await condominio.find(filters, { }, paginate);
  }
  static async getById(_id) {
    return await condominio.findById({ _id });
  }
  static async getByCodigo(codigo) {
    return await condominio.findONe(
      { codigo },
      { _id: 1, nome: 1, codigo: 1 }
    );
  }

  static async create(data) {
    const condominioCreate = { ...data };
    return await condominio.create(condominioCreate);
  }

  static async update(data) {
    const { _id, ...rest } = data;
    return await condominio.findOneAndUpdate({ _id }, rest);
  }

  static async delete(_id) {
    return await condominio.findOneAndDelete({ _id });
  }
};
