const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, require: true, set: function (v) { return v?.trim(); } },
    email: { type: String, require: true, unique: true, set: function (v) { return v?.trim(); } },
    telefone: { type: String, set: function (v) { return v?.replace(/\D+/g, '')?.trim(); } },
    apto: { type: String },
    bloco: { type: String },
    senha: { type: String, require: true },
    tipoUsuario: {
      type: String,
      require: true,
      enum: ["admin", "superAdmin", "morador"],
    },
    ativo: { type: Boolean, require: true, default: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true, default: null },
  },
  { timestamps: true, versionKey: false }
);

UsuarioSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

module.exports = mongoose.model("usuario", UsuarioSchema);
