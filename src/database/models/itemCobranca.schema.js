const mongoose = require("mongoose");

const ItemCobrancaSchema = new mongoose.Schema(
  {
    valor: { type: Number, default: 0 },
    valorRateado: { type: Number, default: 0 },
    _idMovimentacao: { type: mongoose.Types.ObjectId, require: true },
    _idLeitura: { type: mongoose.Types.ObjectId, require: true },
    _idCobranca: { type: mongoose.Types.ObjectId, require: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("itemCobranca", ItemCobrancaSchema, "itemsCobranca");
