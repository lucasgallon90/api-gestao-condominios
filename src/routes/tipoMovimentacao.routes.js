const express = require("express");
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require('joi-objectid')(Joi)
const { messages } = require("joi-translation-pt-br");
const router = express.Router();
const TipoMovimentacaoDTO = require("../database/dtos/tipoMovimentacao.dto.js")
const {
  list,
  get,
  remove,
  create,
  update,
} = require("../controllers/tipoMovimentacao.controller");

router.post(
  "/list",
  /* #swagger.tags = ['Tipos de Movimentacão']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      descricao: 'Cobrança',
                  }}
    */
  celebrate(
    {
      body: Joi.object().keys({
        descricao: Joi.string().optional(),
      }),
      query: Joi.object().keys({ page: Joi.number().optional() }),
    },
    {
      messages: messages,
    }
  ),
  list
);

router.get(
  "/:id",
  /* #swagger.tags = ['Tipos de Movimentacão']
   #swagger.parameters['id'] = {  in: 'path', description: 'id do Tipo de Movimentação', type: 'string', required:true }
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
      body: TipoMovimentacaoDTO,
    },
    {
      messages: messages,
    }),
  /* #swagger.tags = ['Tipos de Movimentacão']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Tipos de Movimentacão',
                  schema: { $ref: '#/definitions/TipoMovimentacao' }
          } */
  create
);

router.put(
  "/update/:id",
  /* #swagger.tags = ['Tipos de Movimentacão']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Tipo de Movimentação',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Tipo de Movimentacão',
                  schema: { $ref: '#/definitions/TipoMovimentacao' }
          } */
  celebrate(
    {
      body: TipoMovimentacaoDTO,
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  update
);

router.delete(
  "/delete/:id",
  /* #swagger.tags = ['Tipos de Movimentacão']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Tipos de Movimentacão', 
    type: 'string', required:true 
  } */
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
