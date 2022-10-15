const mongoose = require("mongoose");

const LeituraSchema = new mongoose.Schema(
  {
    _idUsuarioLeitura: { type: mongoose.Types.ObjectId, require: true },
    leituraAtual: { type: Number, require: true },
    leituraAnterior: { type: Number, require: true },
    taxaFixa: { type: Number, default: 0 },
    valorUnidade: { type: Number, require: true, default: 0 },
    valor: { type: Number, require: true, default: 0 },
    valorTotal: { type: Number, require: true, default: 0 },
    _idTipoLeitura: { type: mongoose.Types.ObjectId, require: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
    mesAno: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("leitura", LeituraSchema);
