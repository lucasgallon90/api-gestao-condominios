const { v4: uuid } = require("uuid");

const caixa = [
  {
    id: uuid(),
    descricao: "Conta Luz Março/2022",
    valor: 50,
    tipoMovimentacao: { descricao: "Conta à pagar", tipo: "S" },
    createdAt: new Date(),
  },
  {
    _id: uuid(),
    descricao: "Taxa Condomínio Apto 402",
    createdAt: new Date(),
    valor: 80.9,
    tipoMovimentacao: { descricao: "Cobrança", tipo: "E" },
  },
];

module.exports = caixa;
