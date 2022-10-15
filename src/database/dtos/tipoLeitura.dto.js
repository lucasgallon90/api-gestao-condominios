const { Joi } = require("celebrate");

const TipoLeituraDTO = Joi.object().keys({
  descricao: Joi.string().required(),
  unidadeMedida: Joi.string().required(),
  valorUnidade: Joi.number().optional(),
  taxaFixa: Joi.number().optional(),
});

module.exports = TipoLeituraDTO;
