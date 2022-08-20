const { v4: uuid } = require("uuid");

const tiposMovimentacao = [
  {
    id: uuid(),
    descricao: "Cobrança",
    tipo: "E",
    createdAt: new Date(),
  },
  {
    id: uuid(),
    descricao: "Conta à pagar",
    tipo: "S",
    createdAt: new Date(),
  },
  {
    id: uuid(),
    descricao: "Ajuste Entrada",
    tipo: "E",
    createdAt: new Date(),
  },
  {
    id: uuid(),
    descricao: "Ajuste Saída",
    tipo: "S",
    createdAt: new Date(),
  },
];

module.exports = tiposMovimentacao;
