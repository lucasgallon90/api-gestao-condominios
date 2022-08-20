const Usuario = require("../database/models/usuario.schema");
const Condominio = require("../database/models/condominio.schema");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../repositories/usuario.repository");

module.exports = class AuthController {
  static async register(req, res, next) {
    const {
      nome,
      email,
      googleId,
      senha,
      codigoCondominio,
      telefone,
      apto,
      bloco,
    } = req.body;
    try {
      if (await Usuario.findOne({ email }))
        return res
          .status(400)
          .send({ error: "Email já cadastrado, por favor escolha outro" });

      const condominio = await Condominio.findOne({ codigoCondominio });
      if (!condominio) {
        return res.status(400).send({
          error:
            "Condomínio não encontrado, por favor digite o código corretamente",
        });
      }

      const user = await Usuario.create({
        nome,
        email,
        senha,
        googleId,
        telefone,
        apto,
        bloco,
        tipoUsuario: "morador",
        _idCondominio: condominio._id,
      });
      const userCreated = JSON.parse(JSON.stringify(user));
      delete userCreated.senha;
      delete userCreated.createdAt;
      delete userCreated.updatedAt;
      return res.json({
        userCreated,
        token: generateToken({ user }),
      });
    } catch (error) {
      console.log(error);
      return next({
        error: error || "Ocorreu um erro ao efetuar o processamento",
        status: 400,
      });
    }
  }

  static authenticate(req, res, next) {
    const { user } = req;
    try {
      if (user) {
        return res.json({
          user,
          refreshToken: generateToken({ user }),
        });
      }
      return next({ error: "Credenciais inválidas", status: 401 });
    } catch (error) {
      console.log(error);
      return next({
        error: error || "Ocorreu um erro ao efetuar o processamento",
        status: 400,
      });
    }
  }
  static success(req, res, next) {
    const { user } = req;
    try {
      return res.json({ user });
      //return next({ error: "Credenciais inválidas", status: 401 });
    } catch (error) {
      console.log(error);
      return next({
        error: error || "Ocorreu um erro ao efetuar o processamento",
        status: 400,
      });
    }
  }

  static failed(req, res, next) {
    /* #swagger.responses[401] = {
                    description: 'Credenciais inválidas',
                    schema: {
                        error:'Credenciais inválidas'
                    }
                    } */
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  static userInfo(req, res, next) {
    const { user } = req;
    try {
      if (user) {
        return res.json(user);
      }
      return next({ error: "Credenciais inválidas", status: 401 });
    } catch (error) {
      console.log(error);
      return next({
        error: error || "Ocorreu um erro ao efetuar o processamento",
        status: 400,
      });
    }
  }
};
