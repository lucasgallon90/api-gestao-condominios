const { v4: uuid } = require("uuid");

const tiposMovimentacao = [
  {
    descricao: "Conta à receber",
    gerarCobranca: false,
    tipo: "E",
  },
  {
    descricao: "Conta à pagar",
    gerarCobranca: true,
    tipo: "S",
  },
  {
    descricao: "Ajuste Entrada",
    gerarCobranca: false,
    tipo: "E",
  },
  {
    descricao: "Ajuste Saída",
    gerarCobranca: false,
    tipo: "S",
  },
];

module.exports = tiposMovimentacao;
