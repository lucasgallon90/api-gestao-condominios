const { v4: uuid } = require("uuid");

const movimentacoes = [
  {
    descricao: "Conta Luz Março/2022",
    valor: 50,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    ratear: true,
  },
  {
    descricao: "Conta Luz Abril/2022",
    valor: 50,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    ratear: true,
  },
];

module.exports = movimentacoes;
