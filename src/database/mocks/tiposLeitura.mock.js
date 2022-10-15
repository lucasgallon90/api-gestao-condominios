const { randomDate } = require("../../utils/index.js");
const { v4: uuid } = require("uuid");

const tiposLeitura = [
  {
    id: uuid(),
    descricao: "Água",
    unidadeMedida: "m3",
    taxaFixa: 30.14,
    valorUnidade:0.64,
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    id: uuid(),
    descricao: "Gás",
    unidadeMedida: "m3",
    taxaFixa: 0,
    valorUnidade:0.5,
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
  },
];

module.exports = tiposLeitura;
