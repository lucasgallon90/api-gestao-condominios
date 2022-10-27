const { randomDate } = require("../../utils/index.js");
const { v4: uuid } = require("uuid");

const tiposLeitura = [
  {
    descricao: "Água",
    unidadeMedida: "m3",
    taxaFixa: 30.14,
    valorUnidade:0.64,
  },
  {
    descricao: "Gás",
    unidadeMedida: "m3",
    taxaFixa: 0,
    valorUnidade:0.5,
  },
];

module.exports = tiposLeitura;
