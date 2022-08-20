const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const LeituraDTO = Joi.object().keys({
  leituraAnterior: Joi.number().required(),
  leituraAtual: Joi.number().required(),
  _idTipoLeitura: Joi.objectId().required(),
  _idUsuarioLeitura: Joi.objectId().required(),
  mesAno: Joi.string().required(),
});

module.exports = LeituraDTO;
