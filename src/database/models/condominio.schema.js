const mongoose = require("mongoose");

const CondominioSchema = new mongoose.Schema(
  {
    nome: { type: String, require: true },
    endereco: { type: String, require: true },
    cidade: { type: String, require: true },
    uf: { type: String, require: true },
    cep: { type: String },
    saldoCaixaInicial: { type: Number, default: 0 },
    saldoCaixaAtual: { type: Number, default: 0 },
    codigoCondominio: { type: String, require: true, unique: true },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("condominio", CondominioSchema);
