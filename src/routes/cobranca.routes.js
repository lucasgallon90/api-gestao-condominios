const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require('joi-objectid')(Joi)
const { messages } = require("joi-translation-pt-br");
const CobrancaDTO = require("../database/dtos/cobranca.dto.js")
const {
  list,
  get,
  getContasMesAno,
  remove,
  create,
  update,
} = require("../controllers/cobrancas.controller");

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
      query: Joi.object().keys({ page: Joi.number().optional() }),
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
  "/create",
  celebrate(
    {
      body: CobrancaDTO,
    },
    {
      messages: messages,
    }),
  /* #swagger.tags = ['Cobrança']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Cobrança',
                  schema: { $ref: '#/definitions/Cobranca' }
          } */
  create
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
    }),
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
