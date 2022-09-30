const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const LeituraDTO = Joi.object().keys({
  leituraAnterior: Joi.number().required(),
  leituraAtual: Joi.number().required(),
  taxaFixa: Joi.number().optional().default(0),
  valorUnidade: Joi.number().required().default(0),
  valor: Joi.number().required().default(0),
  valorTotal: Joi.number().required().default(0),
  _idTipoLeitura: Joi.objectId().required(),
  _idUsuarioLeitura: Joi.objectId().required(),
  mesAno: Joi.string().required(),
});

module.exports = LeituraDTO;
