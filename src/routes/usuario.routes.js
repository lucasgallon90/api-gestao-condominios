const express = require("express");
const router = express.Router();
const {
  list,
  get,
  updateSenha,
  create,
  getMorador,
  listMoradores,
  remove,
  update,
  getTotal,
  updateMorador,
  removeMorador,
  updateUsuarioLogado,
  conviteRegistroEmail,
  conviteRegistroLink,
  recuperarSenha,
} = require("../controllers/usuario.controller");
const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const { messages } = require("joi-translation-pt-br");
const UsuarioDTO = require("../database/dtos/usuario.dto.js");
const authSuperAdminMiddleware = require("../middleware/authSuperAdmin.middleware.js");
const authAdminMiddleware = require("../middleware/authAdmin.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const { LIMIT } = require("../utils");

router.post(
  "/recuperar-senha",
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Recuperar senha',
                schema: { $email: 'nome@email.com' }
        } */
  recuperarSenha
);

router.use(authMiddleware);

router.post(
  "/convite-registro-email",
  authAdminMiddleware,
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Convite de registro por email',
                schema: { $email: 'nome@email.com' }
        } */
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  conviteRegistroEmail
);

router.get(
  "/convite-registro-link",
  authAdminMiddleware,
  /* #swagger.tags = ['Usuário']
        } */
  conviteRegistroLink
);

router.post(
  "/list/moradores",
  authAdminMiddleware,
  celebrate(
    {
      body: Joi.object().keys({
        nome: Joi.string().optional(),
        nomeCondominio: Joi.string().optional(),
        apto: Joi.string().optional(),
        bloco: Joi.string().optional(),
        email: Joi.string().optional(),
        ativo: Joi.boolean().optional(),
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
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                    ativo: true,
                    nome: 'Joaquim',
                    nomeCondominio: 'Frei João II',
                    apto: '401',
                    bloco: 'A',
                    email:'joaquim@gestaodecondominios.com.br'
                }}
  */
  listMoradores
);

router.get(
  "/moradores/:id",
  authMiddleware,
  /* #swagger.tags = ['Usuário']
 #swagger.parameters['id'] = {  in: 'path', description: 'id do usuário', type: 'string', required:true }
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
  getMorador
);

router.put(
  "/moradores/update/:id",
  authMiddleware,
  /* #swagger.tags = ['Usuário']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Usuário',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Usuário',
                schema: { $ref: '#/definitions/Usuario' }
        } */
  celebrate(
    {
      body: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().required(),
        telefone: Joi.string().optional().allow(null, ""),
        apto: Joi.string().optional().allow(null, ""),
        bloco: Joi.string().optional().allow(null, ""),
      }),
      params: Joi.object().keys({
        id: Joi.objectId().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  updateMorador
);

router.delete(
  "/moradores/delete/:id",
  authMiddleware,
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['id'] = {  in: 'path', description: 'id do usuário', type: 'string', required:true } */
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
  removeMorador
);

router.put(
  "/update-usuario-logado",
  authMiddleware,
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Usuário',
                schema: {  
                    nome: 'Joaquim',
                    apto: '401',
                    bloco: 'A',
                    telefone: '54 990000000',
                    email:'joaquim@gestaodecondominios.com.br' }
        } */
  celebrate(
    {
      body: UsuarioDTO,
    },
    {
      messages: messages,
    }
  ),
  updateUsuarioLogado
);

router.post(
  "/list",
  authSuperAdminMiddleware,
  celebrate(
    {
      body: Joi.object().keys({
        nome: Joi.string().optional(),
        nomeCondominio: Joi.string().optional(),
        apto: Joi.string().optional(),
        bloco: Joi.string().optional(),
        email: Joi.string().optional(),
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
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = { in: 'body', description: 'Filtros', type: 'string',  schema: {
                    nome: 'Joaquim',
                    nomeCondominio: 'Frei João II',
                    apto: '401',
                    bloco: 'A',
                    email:'joaquim@gestaodecondominios.com.br'
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
  /* #swagger.tags = ['Usuário']
 #swagger.parameters['id'] = {  in: 'path', description: 'id do usuário', type: 'string', required:true }
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
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Usuário']
   */
  getTotal
);

router.post(
  "/create",
  authSuperAdminMiddleware,
  celebrate(
    {
      body: UsuarioDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Adicionar usuário',
                schema: { $ref: '#/definitions/Usuario' }
        } */
  create
);

router.put(
  "/update/:id",
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Usuário']
   #swagger.parameters['params'] = {
                in: 'params',
                description: 'Id do Usuário',
                schema: { id: '41fc6aa5b49ec355ca0300b4' }
        } 
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Usuário',
                schema: { $ref: '#/definitions/Usuario' }
        } */
  celebrate(
    {
      body: UsuarioDTO,
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

router.put(
  "/update-senha",
  authMiddleware,
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Nova senha',
                schema: { $novaSenha: '123' }
        } */
  celebrate(
    {
      body: Joi.object().keys({
        novaSenha: Joi.string().required(),
      }),
    },
    {
      messages: messages,
    }
  ),
  updateSenha
);

router.delete(
  "/delete/:id",
  authSuperAdminMiddleware,
  /* #swagger.tags = ['Usuário']
  #swagger.parameters['id'] = {  in: 'path', description: 'id do usuário', type: 'string', required:true } */
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
