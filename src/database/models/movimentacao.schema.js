const mongoose = require("mongoose");

const MovimentacaoSchema = new mongoose.Schema(
  {
    descricao: { type: String },
    valor: { type: Number, require: true },
    dataPagamento: { type: Date },
    dataVencimento: { type: Date },
    ratear: { type: Boolean, require: true, default: false }, //RATEAR CONTA ENTRE OS MORADORES
    _idTipoMovimentacao: { type: mongoose.Types.ObjectId },
    _idCondominio: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("movimentacao", MovimentacaoSchema, "movimentacoes");