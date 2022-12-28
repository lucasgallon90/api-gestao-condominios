const usuarioRepository = require("../repositories/usuario.repository.js");
const condominioRepository = require("../repositories/condominio.repository.js");
const { LIMIT, enviarEmail } = require("../utils/index.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../repositories/usuario.repository.js");
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = class Usuario {
  static async list(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
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
      ];
      const totalPipeline = {
        $facet: {
          paginatedResults: [
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      };
      if (afterLookupFilter) {
        pipeline.push(afterLookupFilter);
      }
      pipeline.push(totalPipeline);
      const [results] = await usuarioRepository.list(pipeline);

      const totalCount = results?.totalCount[0]?.count || 0;

      res.setHeader("X-Total-Count", totalCount);
      /* #swagger.responses[200] = {
      description: 'Usuários listados com sucesso',
      schema: [{ $ref: '#/definitions/UsuarioResponse'}]
      } */
      return res
        .status(results?.paginatedResults ? 200 : 204)
        .json(results?.paginatedResults);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
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
            (filters[key] =
              key != "ativo"
                ? { $regex: `.*${filters[key]}.*`, $options: "i" }
                : filters[key])
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
        .json({ user: usuario, token: generateToken({ user: result }) });
    } catch (error) {
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
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
      res.status(400).json({ error });
      console.log(error);
    }
  }

  static async conviteRegistroEmail(req, res) {
    const { user } = req;
    const { email } = req.body;
    try {
      const condominio = await condominioRepository.getById(user._idCondominio);

      const link = `${process.env.CLIENT_URL}register?codigoCondominio=${condominio.codigoCondominio}`;

      await enviarEmail({
        from: `"Sistema de Gestão de Condomínios" <${process.env.NODE_MAILER_EMAIL}>`,
        to: email,
        subject: `Convite para registrar-se - ${condominio.nome}`,
        html: `Olá, segue abaixo o link do convite para registrar-se no condomínio: <b>${condominio.nome}</b><br/>
        <a href="${link}">${link}</a>`,
      });

      return res.json({ message: "Convite enviado com sucesso" });
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }

  static async conviteRegistroLink(req, res) {
    const { user } = req;
    try {
      const condominio = await condominioRepository.getById(user._idCondominio);

      const link = `${process.env.CLIENT_URL}register?codigoCondominio=${condominio.codigoCondominio}`;

      return res.json({ link });
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }

  static async conviteRegistroLink(req, res) {
    const { user } = req;
    try {
      const condominio = await condominioRepository.getById(user._idCondominio);

      const link = `${process.env.CLIENT_URL}register?codigoCondominio=${condominio.codigoCondominio}`;

      return res.json({ link });
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }

  static async recuperarSenha(req, res) {
    const { email } = req.body;
    try {
      const [usuario] = await usuarioRepository.get([
        { $match: { email } },
        { $limit: 1 },
      ]);
      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      delete usuario.senha;
      delete usuario.createdAt;
      delete usuario.updatedAt;

      const token = jwt.sign(
        {
          user: usuario,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 3600, //expira em 1 hora
        }
      );

      const link = `${process.env.CLIENT_URL}nova-senha?token=${token}`;
      await enviarEmail({
        from: `"Sistema de Gestão de Condomínios" <${process.env.NODE_MAILER_EMAIL}>`,
        to: usuario.email,
        subject: "Recuperação de senha - Sistema de Gestão de condomínios",
        html: `Olá, segue o link para criar uma nova senha de acesso ao Sistema de Gestão de condomínios.</br>
       <a href="${link}">Recuperar senha</a>
       <i>(Este link expira em 1 hora)</i>`,
      });
      return res.json({ message: "Email enviado com sucesso" });
    } catch (error) {
      res.status(400).json({ error });
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
      res.status(400).json({ error });
      console.log(error);
    }
  }
};
