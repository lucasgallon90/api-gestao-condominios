const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const MovimentacaoDTO = Joi.object().keys({
  descricao: Joi.string().optional(),
  valor: Joi.number().required(),
  dataPagamento: Joi.date().optional().allow(null).default(null),
  dataVencimento: Joi.date().optional().allow(null).default(null),
  ratear: Joi.boolean().required(),
  _idTipoMovimentacao: Joi.objectId().required(),
  _idTipoLeitura: Joi.objectId().optional(),
});

module.exports = MovimentacaoDTO;
