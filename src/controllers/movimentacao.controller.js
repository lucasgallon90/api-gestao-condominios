const movimentacaoRepository = require("../repositories/movimentacao.repository.js");
const tipoMovimentacaoRepository = require("../repositories/tipoMovimentacao.repository.js");
const condominioRepository = require("../repositories/condominio.repository.js");
const leituraRepository = require("../repositories/leitura.repository.js");
const { LIMIT } = require("../utils/index.js");
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Movimentacao {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        filters._idUsuarioOcorrencia = user._id;
      }
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await movimentacaoRepository.list({
        filters: { _idCondominio: user._idCondominio, ...filters },
        paginate,
      });
      /* #swagger.responses[200] = {
      description: 'Movimentações listadas com sucesso',
      schema: [{ $ref: '#/definitions/MovimentacaoResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const data = { _id: id, _idCondominio: user._idCondominio };

      const result = await movimentacaoRepository.get(data);
      /* #swagger.responses[200] = {
      description: 'Movimentação obtida com sucesso',
      schema: { 
      $ref: '#/definitions/MovimentacaoResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
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
          $lookup: {
            from: "tiposleitura",
            localField: "_idTipoLeitura",
            foreignField: "_id",
            as: "tipoLeitura",
          },
        },
        { $match: { "tipoMovimentacao.gerarCobranca": true } },
        {
          $unwind: {
            path: "$tipoLeitura",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$tipoMovimentacao",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$leitura",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { dataVencimento: 1 } },
      ];
      const results = await movimentacaoRepository.getContasMesAno(filters);
      for (let result of results) {
        if (result.dataVencimento) {
          const leitura = await leituraRepository.get({
            _idTipoLeitura: result._idTipoLeitura,
            mesAno: moment(result.dataVencimento).format("YYYY-MM"),
          });
          if (leitura) {
            result._idLeitura = leitura._id;
            result.leituraAnterior = leitura.leituraAnterior;
            result.leituraAtual = leitura.leituraAtual;
          }
        }
      }
      /* #swagger.responses[200] = {
      description: 'Contas e suas referidas leituras/rateios do mês/ano obtidas com sucesso',
      schema: [{ 
      $ref: '#/definitions/ContaResponse'} ]
      } */
      return res.json(results);
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
        const tipoMovimentacao = await tipoMovimentacaoRepository.get({
          _idCondominio: user._idCondominio,
          _id: movimentacao._idTipoMovimentacao,
        });
        await condominioRepository.update({
          _id: user._idCondominio,
          $inc: {
            saldoCaixaAtual:
              tipoMovimentacao.tipo === "E"
                ? -movimentacao.valor
                : movimentacao.valor,
          },
        });
      }
      return res.json({ message: "Movimentação deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
