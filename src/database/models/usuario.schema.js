const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    telefone: { type: String },
    apto: { type: String },
    bloco: { type: String },
    senha: { type: String, require: true },
    tipoUsuario: {
      type: String,
      require: true,
      enum: ["admin", "superAdmin", "morador"],
    },
    ativo: { type: Boolean, require: true, default: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true, versionKey: false }
);

UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

module.exports = mongoose.model("usuario", UsuarioSchema);
