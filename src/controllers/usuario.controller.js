const usuarioRepository = require("../repositories/usuario.repository.js");
const { LIMIT } = require("../utils/index.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../repositories/usuario.repository.js");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Usuario {
  static async list(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = [
          { $skip: limit * (page - 1) },
          { $limit: limit },
          { $sort: { createdAt: -1 } },
        ];
      }
      if (Object.keys(filters).length > 0) {
        Object.keys(filters).map(
          (key) =>
            (filters[key] = { $regex: `.*${filters[key]}.*`, $options: "i" })
        );
      }
      let afterLookupFilter = null;
      if (filters.nomeCondominio) {
        afterLookupFilter = {
          $match: {
            "condominio.nome": { $regex: `.*${filters.nomeCondominio}.*` },
          },
        };
        delete filters.nomeCondominio;
      }
      let pipeline = [
        {
          $match: { ...filters },
        },
        {
          $lookup: {
            from: "condominios",
            localField: "_idCondominio",
            foreignField: "_id",
            as: "condominio",
          },
        },
        {
          $unwind: {
            path: "$condominio",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            nome: 1,
            email: 1,
            telefone: 1,
            apto: 1,
            bloco: 1,
            tipoUsuario: 1,
            ativo: 1,
            googleId: 1,
            "condominio._id": 1,
            "condominio.nome": 1,
            "condominio.endereco": 1,
            "condominio.cidade": 1,
            "condominio.uf": 1,
            "condominio.cep": 1,
            "condominio.codigoCondominio": 1,
          },
        },
        ...paginate,
      ];
      if (afterLookupFilter) {
        pipeline.push(afterLookupFilter);
      }
      const results = await usuarioRepository.list(pipeline);
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

  static async listMoradores(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.params;
    const { user } = req;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = [
          { $skip: limit * (page - 1) },
          { $limit: limit },
          { $sort: { createdAt: -1 } },
        ];
      }
      if (Object.keys(filters).length > 0) {
        Object.keys(filters).map(
          (key) =>
            (filters[key] = { $regex: `.*${filters[key]}.*`, $options: "i" })
        );
      }
      const results = await usuarioRepository.list([
        {
          $match: {
            _idCondominio: ObjectId(user._idCondominio),
            tipoUsuario: { $ne: "admin" },
            ...filters,
          },
        },
        ...paginate,
      ]);
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
      const [result] = await usuarioRepository.get([
        {
          $match: {
            _id: ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "condominios",
            localField: "_idCondominio",
            foreignField: "_id",
            as: "condominio",
          },
        },
        {
          $unwind: {
            path: "$condominio",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            nome: 1,
            email: 1,
            telefone: 1,
            apto: 1,
            bloco: 1,
            tipoUsuario: 1,
            ativo: 1,
            googleId: 1,
            "condominio._id": 1,
            "condominio.nome": 1,
            "condominio.endereco": 1,
            "condominio.cidade": 1,
            "condominio.uf": 1,
            "condominio.cep": 1,
            "condominio.codigoCondominio": 1,
          },
        },
      ]);
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
      const [result] = await usuarioRepository.get([
        {
          $match: {
            _id: ObjectId(id),
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $project: {
            nome: 1,
            email: 1,
            telefone: 1,
            apto: 1,
            bloco: 1,
          },
        },
      ]);
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

  static async getTotal(req, res) {
    try {
      const result = await usuarioRepository.getTotal();
      /* #swagger.responses[200] = {
      description: 'Total de usuários obtido com sucesso',
      schema: { 
      total: 1
      }
     } */
      return res.json({ total: result || 0 });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const usuario = req.body;
    try {
      if (!usuario.senha) {
        return res.status(400).json({ error: "Senha é obrigatória" });
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
      //Duplicate email
      if (error.code === "11000") {
        return res
          .status(400)
          .json({ error: "Email já existe, por favor selecione outro" });
      }
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const usuario = req.body;
    try {
      const result = await usuarioRepository.update({ _id: id }, usuario);
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

  static async updateUsuarioLogado(req, res) {
    const { user } = req;
    const usuario = req.body;
    try {
      const result = await usuarioRepository.update({ _id: user._id }, usuario);
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      /*
     update
     */
      /* #swagger.responses[200] = {
      description: 'Usuário atualizado com sucesso',
      schema: { 
      $ref: '#/definitions/UsuarioLogadoResponse'} 
      } */
      return res
        .status(200)
        .json({ user: usuario, token: generateToken({ user:result }) });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }

  static async updateMorador(req, res) {
    const { user } = req;
    const { id } = req.params;
    const usuario = req.body;
    try {
      const result = await usuarioRepository.update(
        { _id: id, _idCondominio: user._idCondominio },
        usuario
      );
      /*
     update
     */
      /* #swagger.responses[200] = {
      description: 'Morador atualizado com sucesso',
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
      const result = await usuarioRepository.delete({ _id: id });
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

  static async removeMorador(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const result = await usuarioRepository.delete({
        _id: id,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Morador deletado com sucesso',
      schema: { message: "Morador deletado com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Morador deletado com sucesso" });
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }
};
