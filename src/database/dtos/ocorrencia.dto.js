const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const OcorrenciaDTO = Joi.object().keys({
  motivo: Joi.string().required(),
  descricao: Joi.string().optional(),
  respostaAdmin: Joi.string().optional(),
  situacao: Joi.string().optional().allow("Aberta", "Resolvida", "Não Resolvida","Pendente","Em progresso").default("Aberta"),
  _idUsuarioOcorrencia: Joi.objectId().optional(),
});

module.exports = OcorrenciaDTO;
