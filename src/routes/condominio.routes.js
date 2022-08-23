var express = require("express");
var router = express.Router();
const {
  list,
  get,
  getByCodigo,
  remove,
  create,
  update,
} = require("../controllers/condominio.controller");
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const authSuperAdminMiddleware = require("../middleware/authSuperAdmin.middleware.js");
const CondominioDTO = require("../database/dtos/condominio.dto.js");
const { LIMIT } = require("../utils");

router.post(
  "/list",
  authSuperAdminMiddleware,
  celebrate(
    {
      body: Joi.object().keys({
        nome: Joi.string().optional(),
        endereco: Joi.string().optional(),
        cidade: Joi.string().optional(),
        uf: Joi.objectId().optional(),
      }),
      query: Joi.object().keys({ page: Joi.number().optional(),limit: Joi.number().optional().max(LIMIT), }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Condomínio']
  #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                    nome: 'Frei João II',
                    endereco: 'Rua Joaquim Barbosa, 120, Centro',
                    cidade: 'Porto Alegre',
                    uf: 'RS',
                }}
#swagger.parameters['page'] = { in: 'query', description: 'Paginação', type: 'number',  schema: {
          page: 1,
      }}
  */
  list
);

router.get(
  "/:id",
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Condomínio']
 #swagger.parameters['id'] = {  in: 'path', description: 'id do Condomínio', type: 'string', required:true }
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
  "/:codigo",
  /* #swagger.tags = ['Condomínio']
 #swagger.parameters['codigo'] = {  in: 'path', description: 'Código do Condomínio (Utilizado no cadastro de novos usuários do condomínio)', type: 'string', required:true }
  */
  celebrate(
    {
      params: Joi.object().keys({
        codigo: Joi.string().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  getByCodigo
);

router.post(
  "/create",
  authSuperAdminMiddleware,
  celebrate(
    {
      body: CondominioDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Condomínio']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Adicionar Condomínio',
                schema: { $ref: '#/definitions/Condominio' }
        } */
  create
);

router.put(
  "/update/:id",
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Condomínio']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Condomínio',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Alterar Condomínio',
                schema: { $ref: '#/definitions/Condominio' }
        } */
  celebrate(
    {
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
      body: CondominioDTO,
    },
    {
      messages: messages,
    }
  ),
  update
);

router.delete(
  "/delete/:id",
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Condomínio']
  #swagger.parameters['id'] = {  
      in: 'path', 
  description: 'Deletar Condomínio', 
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
