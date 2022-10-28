const usuario = require("../database/models/usuario.schema.js");
const jwt = require("jsonwebtoken");

module.exports = class Usuario {
  static async list(filters) {
    return usuario.aggregate(filters);
  }
  static async get(filters) {
    return usuario.aggregate(filters);
  }

  static async getTotal() {
    return usuario.countDocuments();
  }

  static async create(data) {
    return usuario.create(data);
  }

  static async update(filters, data) {
    return usuario.findByIdAndUpdate(filters, data,{ new: true });
  }

  static async changeSenha(_id, senha) {
    return usuario.findOneAndUpdate({ _id }, { senha });
  }

  static async delete(filters) {
    return usuario.deleteOne(filters);
  }

  static generateToken(params = {}) {
    return jwt.sign(params, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
  }
};
