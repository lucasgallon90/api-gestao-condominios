var express = require("express");
var router = express.Router();
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const LeituraDTO = require("../database/dtos/leitura.dto.js");
const {
  list,
  get,
  remove,
  create,
  update,
  getLeituraAnterior,
} = require("../controllers/leitura.controller");
const { LIMIT } = require("../utils/index.js");

router.post(
  "/list",
  celebrate(
    {
      body: Joi.object().keys({
        morador: Joi.string().optional(),
        mesAno: Joi.string().optional(),
        _idTipoLeitura: Joi.string().optional(),
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
  /* #swagger.tags = ['Leitura']
    #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                      morador: 'Joaquim',
                      mesAno: '2022-03',
                      _idTipoLeitura: '61fc6aa5b49ec355ca0300b4',
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
  /* #swagger.tags = ['Leitura']
   #swagger.parameters['id'] = {  in: 'path', description: 'id do Leitura', type: 'string', required:true }
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
  "/leitura-anterior/:idUsuario",
  /* #swagger.tags = ['Leitura']
   #swagger.parameters['id'] = {  in: 'path', description: 'id do Usuário', type: 'string', required:true }
    */
  celebrate(
    {
      params: Joi.object().keys({
        idUsuario: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  getLeituraAnterior
);

router.post(
  "/create",
  celebrate(
    {
      body: LeituraDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Leitura']
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Adicionar Leitura',
                  schema: { $ref: '#/definitions/Leitura' }
          } */
  create
);

router.put(
  "/update/:id",
  /* #swagger.tags = ['Leitura']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id da Leitura',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
    #swagger.parameters['body'] = {
                  in: 'body',
                  description: 'Alterar Leitura',
                  schema: { $ref: '#/definitions/Leitura' }
          } */
  celebrate(
    {
      body: LeituraDTO,
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
  /* #swagger.tags = ['Leitura']
    #swagger.parameters['id'] = {  
        in: 'path', 
    description: 'Deletar Leitura', 
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
