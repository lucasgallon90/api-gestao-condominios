const { v4: uuid } = require("uuid");

const leituras = [
  {
    leituraAtual: 105.4,
    leituraAnterior: 101.1,
    mesAno: "03/2022",
    taxaFixa: 5,
    valorUnidade: 0.3,
    valor: 10,
    valorTotal: 15,
  },
  {
    leituraAtual: 115.4,
    leituraAnterior: 111.1,
    mesAno: "04/2022",
    taxaFixa: 5,
    valorUnidade: 0.3,
    valor: 20,
    valorTotal: 25,
  },
];

module.exports = leituras;
