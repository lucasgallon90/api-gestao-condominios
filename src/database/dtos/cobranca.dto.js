const mongoose = require("mongoose");
const { celebrate, Joi } = require("celebrate");
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
        _idMovimentacao: Joi.objectId().required(),
        _idLeitura: Joi.objectId().required(),
        valor: Joi.number().default(0),
        valorRateado: Joi.number().default(0),
      })
    ),
});

module.exports = CobrancaDTO;
