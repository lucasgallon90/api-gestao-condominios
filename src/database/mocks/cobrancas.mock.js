const { v4: uuid } = require("uuid");

const cobrancas = [
  {
    id: uuid(),
    descricao: "Condominio Março/2022 Apto 402",
    valor: 50,
    mesAno: "03/2022",
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    createdAt: new Date(),
    itemsCobranca: [
      {
        id: uuid(),
        descricao: "Conta Luz Março/2022",
        valorTotal: 50,
        valorRateioLeitura: 5,
        leitura: 0,
        dataPagamento: new Date(),
        dataVencimento: new Date(),
        tipoMovimentacao: { descricao: "Conta à pagar", tipo: "S" },
        createdAt: new Date(),
      },
    ],
  },
];

module.exports = cobrancas;
