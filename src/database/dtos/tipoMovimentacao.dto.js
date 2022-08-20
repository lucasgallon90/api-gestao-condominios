const { Joi } = require("celebrate");

const TipoMovimentacaoDTO = Joi.object().keys({
  descricao: Joi.string().required(),
  gerarCobranca: Joi.boolean().required(),
  tipo: Joi.string().required(),
});

module.exports = TipoMovimentacaoDTO;