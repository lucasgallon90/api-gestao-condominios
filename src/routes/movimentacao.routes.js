const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require('joi-objectid')(Joi)
const { messages } = require("joi-translation-pt-br");
const MovimentacaoDTO = require("../database/dtos/movimentacao.dto.js")
const {
  list,
  get,
  getContasMesAno,
  remove,
  create,
  update,
} = require("../controllers/movimentacao.controller");

router.post(
  "/list",
  celebrate(
    {
      body: Joi.object().keys({
        createdAt: Joi.objectId().optional(),
        descricao: Joi.string().optional(),
        dataVencimento: Joi.objectId().optional(),
        dataPagamento: Joi.objectId().optional(),
      }),
      query: Joi.object().keys({ page: Joi.number().optional() }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      createdAt: '2022-01-01',
                      descricao: 'Conta de Luz Março/2022',
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
  /* #swagger.tags = ['Movimentação']
   #swagger.parameters['id'] = {  in: 'path', description: 'id da Movimentação', type: 'string', required:true }
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
  "/contas-rateio",
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['body'] = { in: 'body', description: 'Parâmetros para obter as contas a serem rateadas e suas referidas leituras do mês/ano para gerar uma cobrança', type: 'string',  schema: {
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
      body: MovimentacaoDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Movimentação',
                  schema: { $ref: '#/definitions/Movimentacao' }
          } */
  create
);

router.put(
  "/update/:id",
  /* #swagger.tags = ['Movimentação']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id da Movimentação',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Movimentação',
                  schema: { $ref: '#/definitions/Movimentacao' }
          } */
  celebrate(
    {
      body: MovimentacaoDTO,
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
  /* #swagger.tags = ['Movimentação']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Movimentação', 
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
