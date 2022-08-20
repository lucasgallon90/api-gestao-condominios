const movimentacao = require("../database/models/movimentacao.schema.js");
const cobranca = require("../database/models/cobranca.schema.js");
const condominio = require("../database/models/condominio.schema.js");

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

  static async updateSaldoInicial({ filters, data }) {
    return await condominio.findOneAndUpdate(filters, data);
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
};
