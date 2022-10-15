const { Joi } = require("celebrate");

const CondominioDTO = Joi.object().keys({
    nome: Joi.string().required(),
    endereco: Joi.string().required(),
    cidade: Joi.string().required(),
    uf: Joi.string().required(),
    cep: Joi.string().optional(),
    saldoCaixaInicial: Joi.number().optional(),
    codigoCondominio: Joi.string().required(),
    ativo: Joi.boolean().optional(),
  });

module.exports = CondominioDTO;
