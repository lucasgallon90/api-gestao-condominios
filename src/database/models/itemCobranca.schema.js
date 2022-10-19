const mongoose = require("mongoose");

const ItemCobrancaSchema = new mongoose.Schema(
  {
    descricao: { type: String },
    valor: { type: Number, default: 0 },
    unidadeMedida: { type: String },
    taxaFixa: { type: Number, default: 0 },
    valorLeitura: { type: Number, default: 0 },
    valorMovimentacao: { type: Number, default: 0 },
    leitura: { type: Number, default: 0 },
    _idMovimentacao: { type: mongoose.Types.ObjectId },
    _idLeitura: { type: mongoose.Types.ObjectId },
    _idCobranca: { type: mongoose.Types.ObjectId, require: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
  "itemCobranca",
  ItemCobrancaSchema,
  "itemsCobranca"
);
