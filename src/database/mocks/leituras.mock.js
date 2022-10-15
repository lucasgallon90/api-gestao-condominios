const { v4: uuid } = require("uuid");

const leituras = [
  {
    id: uuid(),
    morador: { nome: "Joaquim" },
    leituraAtual: 105.4,
    leituraAnterior: 101.1,
    tipoLeitura: { descricao: "Água" },
    mesAno: "03/2022",
  },
];

module.exports = leituras;
