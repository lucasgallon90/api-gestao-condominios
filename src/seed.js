const dotenv = require("dotenv");
const { connect } = require("./database");
const usuario = require("../src/database/models/usuario.schema");
const mongoose = require("mongoose");
dotenv.config();

connect();

const seedDB = async () => {
  const uniqueEmail = await usuario.findOne({
    email: process.env.SEED_EMAIL_SUPER_ADMIN,
  });
  if (!uniqueEmail) {
    await usuario.create({
      nome: "Super Admin",
      email: process.env.SEED_EMAIL_SUPER_ADMIN,
      senha: process.env.SEED_PASSWORD_SUPER_ADMIN,
      tipoUsuario: "superAdmin",
    });
  }
  mongoose.connection.close();
};

seedDB();
