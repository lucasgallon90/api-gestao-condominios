const mongoose = require("mongoose");

const TipoLeituraSchema = new mongoose.Schema({
  descricao: { type: String, require: true },
  unidadeMedida: { type: String, require: true } /*m3, lts*/,
  valorUnidade: { type: Number, default: 0 },
  taxaFixa: { type: Number, default: 0 },
  _idCondominio: { type: mongoose.Types.ObjectId, require: true }},
  {timestamps: true,versionKey: false }
);

module.exports = mongoose.model("tipoLeitura", TipoLeituraSchema,"tiposleitura");
