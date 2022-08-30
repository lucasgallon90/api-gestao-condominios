const usuario = require("../database/models/usuario.schema.js");
const jwt = require("jsonwebtoken");

module.exports = class Usuario {
  static async list(filters) {
    return await usuario.aggregate(filters);
  }
  static async get(pipeline) {
    return await usuario.aggregate(pipeline);
  }

  static async getTotal() {
    return await usuario.countDocuments();
  }

  static async create(data) {
    return await usuario.create(data);
  }

  static async update(filters, data) {
    const result = await usuario.findByIdAndUpdate(filters, data);
    if (result) {
      return data;
    } else {
      throw new Error("id não encontrado");
    }
  }

  static async changeSenha(_id, senha) {
    return await usuario.findOneAndUpdate({ _id }, { senha });
  }

  static async delete(_id) {
    console.log(_id);
    return usuario.deleteOne({ _id });
  }

  static generateToken(params = {}) {
    return jwt.sign(params, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
  }
};
