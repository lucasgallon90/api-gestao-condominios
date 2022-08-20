const mongoose = require("mongoose");

const TipoMovimentacaoSchema = new mongoose.Schema(
  {
    descricao: { type: String, require: true }, //CONTA A PAGAR, AJUSTE DE ENTRADA CAIXA, AJUSTE DE SAÍDA DE CAIXA
    gerarCobranca: { type: Boolean, require: true, default: false }, //
    tipo: { type: String, enum: ["E", "S"], require: true }, //(E) ENTRADA, (S) SAÍDA
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("tipoMovimentacao", TipoMovimentacaoSchema, "tiposmovimentacao");
