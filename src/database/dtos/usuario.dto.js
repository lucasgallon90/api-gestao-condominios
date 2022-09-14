const { Joi } = require("celebrate");

const UsuarioDTO = Joi.object().keys({
  nome: Joi.string().required(),
  email: Joi.string().required(),
  telefone: Joi.string().optional().allow(null,""),
  apto: Joi.string().optional().allow(null,""),
  bloco: Joi.string().optional().allow(null,""),
  senha: Joi.string().optional().allow(null,""),
  tipoUsuario: Joi.string().optional().allow("admin", "superAdmin", "morador"),
  ativo: Joi.boolean().optional().default(true), 
  googleId: Joi.string().optional().allow(null,""),
  codigoCondominio: Joi.string().optional().allow(null,""),
  _idCondominio: Joi.string().optional().allow(null,"")
});

module.exports = UsuarioDTO;
