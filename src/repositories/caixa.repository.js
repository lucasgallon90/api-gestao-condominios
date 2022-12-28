const movimentacao = require("../database/models/movimentacao.schema.js");
const cobranca = require("../database/models/cobranca.schema.js");
const condominio = require("../database/models/condominio.schema.js");
const { groupByKey } = require("../utils/index.js");

module.exports = class Caixa {
  static async list({ filters, paginate }) {
    const cobrancas = await cobranca
      .find(filters, {}, paginate)
      .sort("createdAt");
    const movimentacoes = await movimentacao
      .find(filters, {}, paginate)
      .sort("createdAt");
    let results = [...movimentacoes, ...cobrancas];
    return results;
  }

  static async totalPeriodo(filters) {
    let movimentacoes = await movimentacao.aggregate([
      {
        $match: filters,
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
      {
        $group: {
          _id: {
            tipoMovimentacao: "$tipoMovimentacao.tipo",
            year: { $year: "$dataPagamento" },
            month: { $month: "$dataPagamento" },
          },
          total: { $sum: "$valor" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          tipoMovimentacao: "$_id.tipoMovimentacao",
          mesAno: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
        },
      },
    ]);
    const cobrancas = await cobranca.aggregate([
      {
        $match: filters,
      },
      {
        $group: {
          _id: {
            year: { $year: "$dataPagamento" },
            month: { $month: "$dataPagamento" },
          },
          total: { $sum: "$valor" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          tipoMovimentacao: "$_id.tipoMovimentacao",
          mesAno: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
        },
      },
    ]);
    if (cobrancas?.length > 0) {
      cobrancas.map((cobranca) => {
        let movimentacaoFound = movimentacoes.find(
          (movimentacao) =>
            movimentacao.tipoMovimentacao === "E" &&
            movimentacao.mesAno === cobranca.mesAno
        );
        if (movimentacaoFound) {
          movimentacaoFound.total = movimentacaoFound.total + cobranca.total;
        } else {
          let cobrancaToPush = { ...cobranca };
          cobrancaToPush.tipoMovimentacao = "E";
          movimentacoes.push(cobrancaToPush);
        }
      });
    }
    movimentacoes?.sort(function (a, b) {
      return new Date(a.mesAno + "-01") - new Date(b.mesAno + "-01");
    });
    movimentacoes = groupByKey(movimentacoes, "mesAno");
    return movimentacoes;
  }

  static async updateSaldoInicial({ filters, data }) {
    return await condominio.findOneAndUpdate(filters, data);
  }

  static async getSaldos(filters) {
    return condominio.findOne(filters, {
      saldoCaixaInicial: 1,
      saldoCaixaAtual: 1,
    });
  }

  static async getSaldoAtual(filters) {
    return await condominio.findOne(filters, { saldoCaixaAtual: 1 });
  }

  static async getTotalSaidas(filters) {
    return await movimentacao.aggregate(filters);
  }
  static async getTotalEntradas(filtersMovimentacoes, filtersCobrancas) {
    const [totalMovimentacoes] = await movimentacao.aggregate(
      filtersMovimentacoes
    );
    const [totalCobrancas] = await cobranca.aggregate(filtersCobrancas);
    return {
      total: (totalMovimentacoes?.total || 0) + (totalCobrancas?.total || 0),
    };
  }

  static async getTotalCount(filters) {
    const cobrancas = (await cobranca.countDocuments(filters)) || 0;
    const movimentacoes = (await movimentacao.countDocuments(filters)) || 0;
    return cobrancas + movimentacoes;
  }
};
