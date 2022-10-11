const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const { messages } = require("joi-translation-pt-br");
const {
  list,
  updateSaldoInicial,
  getSaldoAtual,
  getTotalSaidas,
  getTotalEntradas,
} = require("../controllers/caixa.controller");
const { LIMIT } = require("../utils");

router.post(
  "/consolidado",
  celebrate(
    {
      params: Joi.object().keys({
        dataPagamento: Joi.string().optional(),
      }),
      query: Joi.object().keys({
        page: Joi.number().optional(),
        limit: Joi.number().optional().max(LIMIT),
      }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Caixa']
      #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                        dataPagamento: '2022-01-01',
                    }}
     #swagger.parameters['page'] = { in: 'query', description: 'Paginação', type: 'number',  schema: {
          page: 1,
      }}
     #swagger.parameters['limit'] = {
  in: 'query',
  description: 'Limite de registros',
  schema: {
      limit:1,
  }
}
      */
  list
);

router.put(
  "/saldo-inicial",
  celebrate(
    {
      body: Joi.object().keys({
        saldoInicial: Joi.number().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Caixa']
      #swagger.parameters['body'] = { in: 'body', description: 'Saldo inicial do caixa', type: 'string',  schema: {
                        $saldoInicial: 500,
                    }}
      */
  updateSaldoInicial
);

router.get(
  "/saldo-atual",
  /* #swagger.tags = ['Caixa']
  #swagger.description = 'Saldo atual do caixa'
      */
  getSaldoAtual
);

router.get(
  "/total-saidas",
  /* #swagger.tags = ['Caixa']
  #swagger.description = 'Total de saídas'
      */
  getTotalSaidas
);

router.get(
  "/total-entradas",
  /* #swagger.tags = ['Caixa']
  #swagger.description = 'Total de entradas'
      */
  getTotalEntradas
);

module.exports = router;
