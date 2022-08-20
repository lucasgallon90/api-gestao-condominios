const usuarioRepository = require("../repositories/usuario.repository.js");
const { LIMIT } = require("../utils/index.js");
const bcrypt = require("bcrypt");

module.exports = class Usuario {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await usuarioRepository.list({
        filters: { ...filters },
        paginate,
      });
      /* #swagger.responses[200] = {
      description: 'Usuários listados com sucesso',
      schema: [{ $ref: '#/definitions/UsuarioResponse'}]
      } */
      return res.status(results ? 200 : 204).json(results);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async listMoradores(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.params;
    const { user } = req;
    try {
      let paginate = {};
      if (page) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await usuarioRepository.list({
        filters: { _idCondominio: user._idCondominio, ...filters },
        paginate,
      });
      /* #swagger.responses[200] = {
      description: 'Usuários listados com sucesso',
      schema: [{ $ref: '#/definitions/UsuarioResponse'}]
      } */
      return res.status(results ? 200 : 204).json(results);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  static async get(req, res) {
    const { id } = req.params;
    try {
      const result = await usuarioRepository.getById(id);
      /* #swagger.responses[200] = {
      description: 'Usuário obtido com sucesso',
      schema: { 
      $ref: '#/definitions/UsuarioResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async getMorador(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const result = await usuarioRepository.get({
        _id: id,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Usuário obtido com sucesso',
      schema: { 
      $ref: '#/definitions/UsuarioResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async create(req, res) {
    const usuario = req.body;
    try {
      if(!usuario.senha){
        res.status(400).json({error:"Senha é obrigatória"})
      }
      const result = await usuarioRepository.create(usuario);
      /*
      verificar se email já existe, se usuário não for super admin obter o idCondominio do usuário autenticado.
      create
      */
      /* #swagger.responses[200] = {
      description: 'Usuário criado com sucesso',
      schema: { 
      $ref: '#/definitions/UsuarioResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async update(req, res) {
    const usuario = req.body;
    try {
      const result = await tipoMovimentacaoRepository.findOneAndUpdate(
        { _id: id },
        usuario
      );
      /*
     update
     */
      /* #swagger.responses[200] = {
      description: 'Usuário atualizado com sucesso',
      schema: { 
      $ref: '#/definitions/UsuarioResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? usuario : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async updateSenha(req, res) {
    const { user } = req;
    const { novaSenha } = req.body;
    try {
      const senhaCrypt = await bcrypt.hash(novaSenha, 10);
      await usuarioRepository.changeSenha(user._id, senhaCrypt);
      /* #swagger.responses[200] = {
      description: 'Senha alterada com sucesso',
      schema: { message: "Senha alterada com sucesso" }
      } */
      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async remove(req, res) {
    const { id } = req.params;
    try {
      const result = await usuario.delete({ _id: id });
      /*
      deletar o usuário
      */
      /* #swagger.responses[200] = {
      description: 'Usuário deletado com sucesso',
      schema: { message: "Usuário deletado com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }
};
