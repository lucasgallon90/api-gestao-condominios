const express = require("express");
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const router = express.Router();
const OcorrenciaDTO = require("../database/dtos/ocorrencia.dto.js");
const {
  list,
  get,
  remove,
  create,
  update,
  getTotal,
} = require("../controllers/ocorrencia.controller");
const { LIMIT } = require("../utils/index.js");

router.post(
  "/list",
  celebrate(
    {
      body: Joi.object().keys({
        createdAt: Joi.date().optional(),
        motivo: Joi.string().optional(),
        situacao: Joi.string().optional(),
        nomeMorador: Joi.string().optional(),
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
  /* #swagger.tags = ['Ocorrência']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      createdAt: '2022-03-01',
                      motivo:'Problema',
                       situacao:'Aberta',
                      nomeMorador: 'Morador',
                  }}
  #swagger.parameters['page'] = {
            in: 'query',
            description: 'Paginação',
            schema: {
                page:1,
            }
          }
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
  /* #swagger.tags = ['Ocorrência']
   #swagger.parameters['id'] = {  in: 'path', description: 'id da Ocorrência', type: 'string', required:true }
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

router.get(
  "/count/total",
  /* #swagger.tags = ['Ocorrência']
   */
  getTotal
);

router.post(
  "/create",
  /* #swagger.tags = ['Ocorrência']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Ocorrência',
                  schema: { $ref: '#/definitions/Ocorrencia' }
          } */
  celebrate(
    {
      body: OcorrenciaDTO,
    },
    {
      messages: messages,
    }
  ),
  create
);

router.put(
  "/update/:id",
  /* #swagger.tags = ['Ocorrência']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Ocorrência',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Ocorrência',
                  schema: { $ref: '#/definitions/Ocorrencia' }
          } */
  celebrate(
    {
      body: OcorrenciaDTO,
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
  /* #swagger.tags = ['Ocorrência']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Ocorrência', 
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
