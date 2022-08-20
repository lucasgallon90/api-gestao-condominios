const { v4: uuid } = require("uuid");

const movimentacoes = [
  {
    id: uuid(),
    descricao: "Conta Luz Março/2022",
    valor: 50,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    tipoMovimentacao: { descricao: "Conta à pagar", tipo: "S" },
    createdAt: new Date(),
    ratear: true,
  },
];

module.exports = movimentacoes;
