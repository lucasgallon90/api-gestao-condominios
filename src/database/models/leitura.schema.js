const mongoose = require("mongoose");

const LeituraSchema = new mongoose.Schema(
  {
    _idUsuarioLeitura: { type: mongoose.Types.ObjectId, require: true },
    leituraAtual: { type: Number, require: true },
    leituraAnterior: { type: Number, require: true },
    _idTipoLeitura: { type: mongoose.Types.ObjectId, require: true },
    _idCondominio: { type: mongoose.Types.ObjectId, require: true },
    mesAno: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("leitura", LeituraSchema);
