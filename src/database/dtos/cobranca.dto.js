const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

const CobrancaDTO = Joi.object().keys({
  descricao: Joi.string().optional(),
  mesAno: Joi.string().required(),
  valor: Joi.number().required(),
  dataPagamento: Joi.date().optional().allow(null).default(null),
  dataVencimento: Joi.date().optional().allow(null).default(null),
  _idUsuarioCobranca: Joi.string().required(),
  itemsCobranca: Joi.array()
    .optional()
    .items(
      Joi.object().keys({
        _idMovimentacao: Joi.objectId().optional(),
        _idLeitura: Joi.objectId().optional(),
        descricao: Joi.string().optional(),
        valor: Joi.number().optional().default(0),
        unidadeMedida: Joi.string().optional(),
        taxaFixa: Joi.number().optional().default(0),
        valorLeitura: Joi.number().optional().default(0),
        valorMovimentacao: Joi.number().optional().default(0),
        leitura: Joi.number().optional().default(0),
      })
    ),
});

module.exports = CobrancaDTO;
