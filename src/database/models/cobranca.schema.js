const mongoose = require("mongoose");

const CobrancaSchema = new mongoose.Schema(
  {
    descricao: { type: String },
    mesAno: { type: String, require: true },
    valor: { type: Number, require: true, default: 0 },
    dataPagamento: { type: Date },
    dataVencimento: { type: Date },
    _idUsuarioCobranca: { type: mongoose.Types.ObjectId, require: true },
    _idCondominio: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("cobranca", CobrancaSchema);
