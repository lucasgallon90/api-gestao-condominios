const movimentacaoRepository = require("../repositories/movimentacao.repository.js");
const tipoMovimentacaoRepository = require("../repositories/tipoMovimentacao.repository.js");
const condominioRepository = require("../repositories/condominio.repository.js");
const leituraRepository = require("../repositories/leitura.repository.js");
const { LIMIT } = require("../utils/index.js");
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Movimentacao {
  static async list(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
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

      let pipeline = [
        {
          $match: { _idCondominio: ObjectId(user._idCondominio), ...filters },
        },
        {
          $lookup: {
            from: "tiposmovimentacao",
            localField: "_idTipoMovimentacao",
            foreignField: "_id",
            as: "tipoMovimentacao",
          },
        },
        {
          $unwind: {
            path: "$tipoMovimentacao",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...paginate,
      ];
      const results = await movimentacaoRepository.list(pipeline);
      /* #swagger.responses[200] = {
      description: 'Movimentações listadas com sucesso',
      schema: [{ $ref: '#/definitions/MovimentacaoResponse'}]
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
      let pipeline = [
        {
          $match: {
            _idCondominio: ObjectId(user._idCondominio),
            _id: ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "tiposmovimentacao",
            localField: "_idTipoMovimentacao",
            foreignField: "_id",
            as: "tipoMovimentacao",
          },
        },
        {
          $unwind: {
            path: "$tipoMovimentacao",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      const [result] = await movimentacaoRepository.get(pipeline);
      /* #swagger.responses[200] = {
      description: 'Movimentação obtida com sucesso',
      schema: { 
      $ref: '#/definitions/MovimentacaoResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async getContasMesAno(req, res) {
    const { user } = req;
    const { mesAno, _idUsuario } = req.body;
    try {
      const data = moment(mesAno + "-01");
      const startOfMonth = moment(data).startOf("month").toDate();
      const endOfMonth = moment(data).endOf("month").toDate();

      const filters = [
        {
          $match: {
            dataVencimento: { $gte: startOfMonth, $lte: endOfMonth },
            ratear: true,
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $lookup: {
            from: "tiposmovimentacao",
            localField: "_idTipoMovimentacao",
            foreignField: "_id",
            as: "tipoMovimentacao",
          },
        },
        {
          $unwind: {
            path: "$tipoMovimentacao",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { dataVencimento: 1 } },
      ];
      const results = await movimentacaoRepository.getContasMesAno(filters);

      const leituras = await leituraRepository.get([
        {
          $match: {
            _idCondominio: ObjectId(user._idCondominio),
            _idUsuarioLeitura: _idUsuario,
            mesAno: mesAno,
          },
        },
      ]);
      /* #swagger.responses[200] = {
      description: 'Contas e suas referidas leituras/rateios do mês/ano obtidas com sucesso',
      schema: [{ 
      $ref: '#/definitions/ContaResponse'} ]
      } */
      return res.json([...results, ...leituras]);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const movimentacao = req.body;
    const { user } = req;
    try {
      const result = await movimentacaoRepository.create({
        ...movimentacao,
        _idCondominio: user._idCondominio,
      });
      if (movimentacao.dataPagamento && movimentacao.valor > 0) {
        const tipoMovimentacao = await tipoMovimentacaoRepository.get({
          _idCondominio: user._idCondominio,
          _id: movimentacao._idTipoMovimentacao,
        });
        await condominioRepository.update({
          _id: user._idCondominio,
          $inc: {
            saldoCaixaAtual:
              tipoMovimentacao.tipo === "E"
                ? movimentacao.valor
                : -movimentacao.valor,
          },
        });
      }

      /* #swagger.responses[200] = {
      description: 'Movimentação criada com sucesso',
      schema: { 
      $ref: '#/definitions/MovimentacaoResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const movimentacao = req.body;
    const { user } = req;
    try {
      const filters = { _id: id, _idCondominio: user._idCondominio };
      if (user.tipoUsuario != "admin") {
        filters._idUsuario = user._id;
      }
      const result = await movimentacaoRepository.update({
        filters,
        data: movimentacao,
      });
      if (movimentacao.valor > 0) {
        const tipoMovimentacao = await tipoMovimentacaoRepository.get({
          _idCondominio: user._idCondominio,
          _id: movimentacao._idTipoMovimentacao,
        });
        if (!result.dataPagamento && movimentacao.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: {
              saldoCaixaAtual:
                tipoMovimentacao.tipo === "E"
                  ? movimentacao.valor
                  : -movimentacao.valor,
            },
          });
        } else if (result.dataPagamento && !movimentacao.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: {
              saldoCaixaAtual:
                tipoMovimentacao.tipo === "E" ? -result.valor : result.valor,
            },
          });
        } else if (
          result.dataPagamento &&
          movimentacao.dataPagamento &&
          result.valor != movimentacao.valor
        ) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: {
              saldoCaixaAtual:
                tipoMovimentacao.tipo === "E"
                  ? movimentacao.valor - result.valor
                  : result.valor - movimentacao.valor,
            },
          });
        }
      }
      /* #swagger.responses[200] = {
      description: 'Movimentação atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/MovimentacaoResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? movimentacao : { error: "Registro não encontrado" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      let filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await movimentacaoRepository.delete(filters);
      /* #swagger.responses[200] = {
      description: 'Movimentação deletada com sucesso',
      schema: { message: "Movimentação deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      } else {
        if (result.dataPagamento) {
          const tipoMovimentacao = await tipoMovimentacaoRepository.get({
            _idCondominio: user._idCondominio,
            _id: result._idTipoMovimentacao,
          });
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: {
              saldoCaixaAtual:
                tipoMovimentacao.tipo === "E" ? -result.valor : result.valor,
            },
          });
        }
      }
      return res.json({ message: "Movimentação deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
