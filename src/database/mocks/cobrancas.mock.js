const { v4: uuid } = require("uuid");

const cobrancas = [
  {
    descricao: "Condominio Outubro/2022 Apto 402",
    mesAno:"2022-10",
    valor: 50,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    itemsCobranca: [
      {
        descricao: "Água",
        valor: 15,
        unidadeMedida: "m3",
        taxaFixa: 5,
        valorLeitura: 10,
        valorMovimentacao: 0,
      },
    ],
  },
  {
    descricao: "Condominio Outubro/2022 Apto 403",
    mesAno:"2022-10",
    valor: 50,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    itemsCobranca: [
      {
        descricao: "Água",
        valor: 15,
        unidadeMedida: "m3",
        taxaFixa: 5,
        valorLeitura: 10,
        valorMovimentacao: 0,
      },
    ],
  },
];

module.exports = cobrancas;
