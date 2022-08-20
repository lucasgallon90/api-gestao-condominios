const mongoose = require("mongoose");

const OcorrenciaSchema = new mongoose.Schema({
  motivo: { type: String, require: true },
  descricao: { type: String },
  respostaAdmin: { type: String },
  situacao: { type: String, require: true, enum: ["Aberta", "Resolvida", "Não Resolvida","Pendente","Em progresso"] },
  _idUsuarioOcorrencia: { require: true, type: mongoose.Types.ObjectId},
  _idCondominio: { type: mongoose.Types.ObjectId, require: true},
},{timestamps: true,versionKey: false });

module.exports = mongoose.model("ocorrencia", OcorrenciaSchema);
