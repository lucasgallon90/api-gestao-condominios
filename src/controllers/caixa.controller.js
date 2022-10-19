const caixaRepository = require("../repositories/caixa.repository.js");
const tipoMovimentacaoRepository = require("../repositories/tipoMovimentacao.repository.js");
const { LIMIT } = require("../utils/index.js");
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Caixa {
  static async list(req, res) {
    const { user } = req;
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await caixaRepository.list({
        filters: {
          _idCondominio: user._idCondominio,
          dataPagamento: { $ne: null },
          ...filters,
        },
        paginate,
      });
      results.sort(function (a, b) {
        if (moment(a.createdAt).isAfter(moment(b.createdAt))) {
          return 1;
        }
        if (moment(a.createdAt).isBefore(moment(b.createdAt))) {
          return -1;
        }
        return 0;
      });
      /* #swagger.responses[200] = {
      description: 'Caixa listado com sucesso',
      schema: [{ $ref: '#/definitions/CaixaResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async updateSaldoInicial(req, res) {
    const { user } = req;
    const { saldoInicial } = req.body;
    try {
      const saldosAnteriores = await caixaRepository.getSaldos();
      if (
        saldosAnteriores.saldoCaixaInicial === saldosAnteriores.saldoCaixaAtual &&
        saldoInicial === 0
      ) {
        await caixaRepository.updateSaldoInicial({
          filters: { _id: user._idCondominio },
          data: {
            saldoCaixaInicial: 0,
            saldoCaixaAtual: 0,
          },
        });
      } else {
        await caixaRepository.updateSaldoInicial({
          filters: { _id: user._idCondominio },
          data: {
            saldoCaixaInicial: saldoInicial,
            saldoCaixaAtual:
              saldoInicial +
              (saldosAnteriores.saldoAtual || 0) -
              (saldosAnteriores.saldoInicial || 0),
          },
        });
      }
      /* #swagger.responses[200] = {
      description: 'Saldo inicial do caixa atualizado com sucesso',
      schema: [{ saldoInicial: 500}]
      } */
      return res.json({ saldoInicial });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async getSaldoAtual(req, res) {
    const { user } = req;
    try {
      const result = await caixaRepository.getSaldoAtual({
        filters: { _id: user._idCondominio },
      });
      /* #swagger.responses[200] = {
      description: 'Saldo atual do caixa',
      schema: [{ saldoCaixaAtual: 500}]
      } */
      return res.json({ saldoCaixaAtual: result.saldoCaixaAtual });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async getTotalSaidas(req, res) {
    const { user } = req;
    try {
      const tiposMovimentacao = await tipoMovimentacaoRepository.getIds({
        _idCondominio: user._idCondominio,
        tipo: "S",
      });
      const [result] = await caixaRepository.getTotalSaidas([
        {
          $match: {
            dataPagamento: { $ne: null },
            _idCondominio: ObjectId(user._idCondominio),
            _idTipoMovimentacao: {
              $in: tiposMovimentacao?.map(
                (tipoMovimentacao) => tipoMovimentacao._id
              ),
            },
          },
        },
        { $group: { _id: "$_idCondominio", total: { $sum: "$valor" } } },
      ]);
      /* #swagger.responses[200] = {
      description: 'Total de saídas do caixa',
      schema: [{ saldoInicial: 500}]
      } */
      return res.json({ total: result?.total || 0 });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getTotalEntradas(req, res) {
    const { user } = req;
    try {
      const tiposMovimentacao = await tipoMovimentacaoRepository.getIds({
        _idCondominio: user._idCondominio,
        tipo: "E",
      });
      const result = await caixaRepository.getTotalEntradas(
        [
          {
            $match: {
              dataPagamento: { $ne: null },
              _idCondominio: ObjectId(user._idCondominio),
              _idTipoMovimentacao: {
                $in: tiposMovimentacao?.map(
                  (tipoMovimentacao) => tipoMovimentacao._id
                ),
              },
            },
          },
          { $group: { _id: "$_idCondominio", total: { $sum: "$valor" } } },
        ],
        [
          {
            $match: {
              dataPagamento: { $ne: null },
              _idCondominio: ObjectId(user._idCondominio),
            },
          },
          { $group: { _id: "$_idCondominio", total: { $sum: "$valor" } } },
        ]
      );
      /* #swagger.responses[200] = {
      description: 'Total de saídas do caixa',
      schema: [{ saldoInicial: 500}]
      } */
      return res.json({ total: result.total || 0 });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
