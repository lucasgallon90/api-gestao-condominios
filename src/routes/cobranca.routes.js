const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const CobrancaDTO = require("../database/dtos/cobranca.dto.js");
const {
  list,
  get,
  remove,
  create,
  update,
  getContasMesAno,
  enviarEmail,
} = require("../controllers/cobrancas.controller");
const { LIMIT } = require("../utils/index.js");

router.post(
  "/list",
  celebrate(
    {
      body: Joi.object().keys({
        createdAt: Joi.date().optional(),
        descricao: Joi.string().optional(),
        dataVencimento: Joi.date().optional(),
        dataPagamento: Joi.date().optional(),
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
  /* #swagger.tags = ['Cobrança']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      createdAt: '2022-03-01',
                      descricao: 'Condominio Março/2022 Apto 402',
                      dataVencimento: '2022-03-28',
                      dataPagamento: '2022-03-28',
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

router.get(
  "/:id",
  /* #swagger.tags = ['Cobrança']
   #swagger.parameters['id'] = {  in: 'path', description: 'id da Cobrança', type: 'string', required:true }
    */
  celebrate(
    {
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  get
);

router.post(
  "/contas-leituras-rateio",
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['body'] = { in: 'body', description: 'Parâmetros para obter as contas a serem rateadas e leituras do mês/ano para gerar uma cobrança', type: 'string',  schema: {
                      $mesAno: '2022-03',
                      $_idUsuario: '61fc6aa5b49ec355ca0300b4',
                  }}
    */
  celebrate(
    {
      body: Joi.object().keys({
        mesAno: Joi.string().length(7).required(),
        _idUsuario: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  getContasMesAno
);

router.post(
  "/create",
  celebrate(
    {
      body: CobrancaDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Cobrança']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Cobrança',
                  schema: { $ref: '#/definitions/Cobranca' }
          } */
  create
);

router.post(
  "/enviar-email",
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['body'] = { in: 'body', description: 'Enviar cobrança por email', type: 'string',  schema: {
                      $id: '61fc6aa5b49ec355ca0300b4',
                      email: 'enderecoemail@dominio.com.br',
                  }}
    */
  celebrate(
    {
      body: Joi.object().keys({
        id: Joi.objectId().required(),
        email: Joi.string().optional().allow("", null),
      }),
    },
    {
      messages: messages,
    }
  ),
  enviarEmail
);

router.put(
  "/update/:id",
  celebrate(
    {
      body: CobrancaDTO,
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Cobrança']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id da Cobrança',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Cobrança',
                  schema: { $ref: '#/definitions/Cobranca' }
          } */
  update
);

router.delete(
  "/delete/:id",
  /* #swagger.tags = ['Cobrança']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Cobrança', 
    type: 'string', required:true } */
  celebrate(
    {
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  remove
);

module.exports = router;
