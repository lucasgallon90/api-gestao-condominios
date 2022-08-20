const express = require("express");
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const router = express.Router();
const TipoLeituraDTO = require("../database/dtos/tipoLeitura.dto.js");
const {
  list,
  get,
  remove,
  create,
  update,
} = require("../controllers/tipoLeitura.controller");

router.post(
  "/list",
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
  /* #swagger.tags = ['Tipos de Leitura']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      descricao: 'Luz',
                  }}
   #swagger.parameters['page'] = { in: 'query', description: 'Paginação', type: 'number',  schema: {
          page: 1,
      }}
    */
  list
);

router.get(
  "/:id",
  /* #swagger.tags = ['Tipos de Leitura']
   #swagger.parameters['id'] = {  in: 'path', description: 'id do Tipo de Leitura', type: 'string', required:true }
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
      body: TipoLeituraDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Tipos de Leitura']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Tipos de Leitura',
                  schema: { $ref: '#/definitions/TipoLeitura' }
          } */
  create
);

router.put(
  "/update/:id",
  celebrate(
    {
      body: TipoLeituraDTO,
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Tipos de Leitura']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Tipo de Leitura',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Tipos de Leitura',
                  schema: { $ref: '#/definitions/TipoLeitura' }
          } */
  update
);

router.delete(
  "/delete/:id",
  /* #swagger.tags = ['Tipos de Leitura']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Tipos de Leitura', 
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
