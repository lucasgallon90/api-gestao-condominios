const cobrancaRepository = require("../repositories/cobranca.repository.js");
const condominioRepository = require("../repositories/condominio.repository.js");
const { LIMIT } = require("../utils");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Cobranca {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = [{ $skip: limit * (page - 1) }, { $limit: limit }];
      }
      const results = await cobrancaRepository.list([
        {
          $match: { _idCondominio: ObjectId(user._idCondominio), ...filters },
        },
        {
          $lookup: {
            from: "itemsCobranca",
            localField: "_id",
            foreignField: "_idCobranca",
            as: "itemsCobranca",
          },
        },
        ...paginate,
      ]);
      /* #swagger.responses[200] = {
      description: 'Cobranças listadas com sucesso',
      schema: [{ $ref: '#/definitions/CobrancaResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const filters = [
        {
          $match: {
            _id: ObjectId(id),
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $lookup: {
            from: "itemsCobranca",
            localField: "_id",
            foreignField: "_idCobranca",
            as: "itemsCobranca",
          },
        },
      ];

      const result = await cobrancaRepository.get(filters);
      /* #swagger.responses[200] = {
      description: 'Cobrança obtida com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const cobranca = req.body;
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        cobranca._idUsuarioCobranca = user._id;
      }
      const result = await cobrancaRepository.create({
        ...cobranca,
        _idCondominio: user._idCondominio,
      });
      if (cobranca.dataPagamento && cobranca.valor > 0 && result) {
        await condominioRepository.update({
          _id: user._idCondominio,
          $inc: { saldoCaixaAtual: cobranca.valor },
        });
      }
      /* #swagger.responses[200] = {
      description: 'Cobrança criada com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const cobranca = req.body;
    const { user } = req;
    try {
      const result = await cobrancaRepository.update({
        _id: id,
        ...cobranca,
        _idCondominio: user._idCondominio,
      });

      if (cobranca.valor > 0 && result) {
        if (!result.dataPagamento && cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: cobranca.valor },
          });
        } else if (result.dataPagamento && !cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: -result.valor },
          });
        } else if (result.dataPagamento && cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: cobranca.valor - result.valor },
          });
        }
      }
      /* #swagger.responses[200] = {
      description: 'Cobrança atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      let filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await cobrancaRepository.delete(filters);
      await condominioRepository.update({
        _id: user._idCondominio,
        $inc: { saldoCaixaAtual: -result.valor },
      });
      /* #swagger.responses[200] = {
      description: 'Cobrança deletada com sucesso',
      schema: { message: "Cobrança deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Cobrança deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
