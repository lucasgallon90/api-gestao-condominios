const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/doc/swagger_output.json";

const endpointsFiles = ["./src/app.js"];

const config = {
  info: {
    title: "API Gestão de Condomínios",
    description: "Documentação API - Gestão de Condomínios",
  },
  customSiteTitle: "Documentação API - Gestão de Condomínios",
  host: "gestao-de-condominios.herokuapp.com",
  schemes: ["https"],
  basePath: "/",
  definitions: {
    Usuario: {
      $nome: "Olavo M.",
      $email: "olavo@mockgestaocondominios.com",
      $senha: "123",
      telefone: "51900000000",
      $apto: "201",
      bloco: "A",
      $tipoUsuario: "admin",
      ativo: true,
      googleId: "18098ca98s7c89a7sc7123",
      $_idCondominio: "61fc6aa5b49ec355ca0300b4",
    },
    UsuarioResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      $nome: "Olavo M.",
      $email: "olavo@mockgestaocondominios.com",
      telefone: "51900000000",
      $apto: "201",
      bloco: "A",
      $tipoUsuario: "admin",
      ativo: true,
      googleId: "18098ca98s7c89a7sc7123",
      $_idCondominio: "61fc6aa5b49ec355ca0300b4",
      condominio: {
        $nome: "Edifício Frei Paolo II",
        $endereco: "Rua Joaquim Barbosa, 120, Centro",
        $cidade: "Porto Alegre",
        $uf: "RS",
        $cep: "91000000",
        $codigoCondominio: "freipaolo",
      },
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    Condominio: {
      $nome: "Edifício Frei Paolo II",
      $endereco: "Rua Joaquim Barbosa, 120, Centro",
      $cidade: "Porto Alegre",
      $uf: "RS",
      $cep: "91000000",
      saldoCaixaInicial: 1540,
      saldoCaixaAtual: 1800,
      $codigoCondominio: "freipaolo",
      ativo: true,
    },
    CondominioResponse: {
      $_id: "61fc6aa5b49ec355ca0300b4",
      nome: "Edifício Frei Paolo II",
      endereco: "Rua Joaquim Barbosa, 120, Centro",
      cidade: "Porto Alegre",
      uf: "RS",
      cep: "91000000",
      saldoCaixaInicial: 1540,
      saldoCaixaAtual: 1800,
      codigoCondominio: "freipaolo",
      ativo: true,
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    Leitura: {
      $_idMorador: "61fc6aa5b49ec355ca0300b4",
      $leituraAtual: 105.4,
      $leituraAnterior: 101.1,
      $_idTipoLeitura: "61fc6aa5b49ec355ca0300b4",
      $mesAno: "2022-03",
    },
    LeituraResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      _idMorador: "61fc6aa5b49ec355ca0300b4",
      leituraAtual: 105.4,
      leituraAnterior: 101.1,
      tipoLeitura: {
        _id: "61fc6aa5b49ec355ca0300b4",
        descricao: "Água",
        valorUnidade: 0.6,
        taxaFixa: 34,
      },
      mesAno: "2022-03",
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    Movimentacao: {
      $descricao: "Conta Luz Março/2022",
      $valor: 50,
      dataPagamento: "2022-03-24T20:30:01",
      dataVencimento: "2022-03-24T20:30:01",
      $_idTipoMovimentacao: "61fc6aa5b49ec355ca0300b4",
      _idTipoLeitura: "61fc6aa5b49ec355ca0300b4",
      $ratear: true,
    },
    MovimentacaoResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      descricao: "Conta Luz Março/2022",
      valor: 50,
      dataPagamento: "2022-03-24T20:30:01",
      dataVencimento: "2022-03-24T20:30:01",
      tipoMovimentacao: {
        _id: "21fc6aa5b49ec355ca0300b4",
        descricao: "Conta à pagar",
        tipo: "S",
      },
      tipoLeitura: {
        _id: "11fc6aa5b49ec355ca0300b4",
        descricao: "Água",
        unidadeMedida: "m3",
        valorUnidade: 0.6,
        taxaFixa: 34,
      },
      ratear: true,
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    Cobranca: {
      $descricao: "Condominio Março/2022 apto 402",
      $valor: 50,
      $valorRateioLeitura: 5,
      $mesAno: "2022-03",
      dataPagamento: "2022-03-24T20:30:01",
      dataVencimento: "2022-03-24T20:30:01",
      $_idUsuarioCobranca: "61fc6aa5b49ec355ca0300b4",
      itemsCobranca: [
        {
          valor: 150,
          valorRateado: 15,
          $_idMovimentacao: "61fc6aa5b49ec355ca0300b3",
          $_idLeitura: "61fc6aa5b49ec355ca0300bs",
        },
      ],
    },
    CobrancaResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      descricao: "Condominio Março/2022 apto 402",
      valor: 50,
      valorRateioLeitura: 5,
      mesAno: "2022-03",
      dataPagamento: "2022-03-24T20:30:01",
      dataVencimento: "2022-03-24T20:30:01",
      _idUsuarioCobranca: "61fc6aa5b49ec355ca0300b4",
      itemsCobranca: [
        {
          $_idMovimentacao: "61fc6aa5b49ec355ca0300b3",
          $_idLeitura: "61fc6aa5b49ec355ca0300bs",
        },
      ],
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    ContaResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      descricao: "Conta Luz Março/2022",
      valor: 50,
      _idLeitura: "13cf6aa5b49ec355ca0300b4",
      leituraAnterior: 105.3,
      leituraAtual: 108,
      tipoMovimentacao: {
        _id: "41fc6aa5b49ec355ca0300b4",
        descricao: "Conta à pagar",
        tipo: "S",
      },
      tipoLeitura: {
        _id: "11fc6aa5b49ec355ca0300b4",
        descricao: "Água",
        unidadeMedida: "m3",
        taxaFixa: 30.4,
        valorUnidade: 0.65,
      },
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    CaixaResponse: {
      descricao: "Conta Luz Março/2022",
      valor: 50,
      createdAt: "2022-03-24T20:30:01",
      tipoMovimentacao: {
        _id: "41fc6aa5b49ec355ca0300b4",
        descricao: "Conta à pagar",
        tipo: "S",
      },
    },
    Ocorrencia: {
      motivo: "Problema na luz do andar 1",
      descricao: "Luz deve estar queimada",
      situacao: "Resolvida",
      $_idUsuarioOcorrencia: "11fc6aa5b49ec355ca0300b4",
    },
    OcorrenciaResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      motivo: "Problema na luz do andar 1",
      descricao: "Luz deve estar queimada",
      situacao: "Resolvida",
      usuarioOcorrencia: { id: "11fc6aa5b49ec355ca0300b4", nome: "Joaquim" },
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    TipoLeitura: {
      $descricao: "Água",
      $unidadeMedida: "m3",
      valorUnidade: 0.6,
      taxaFixa: 30.4,
    },
    TipoLeituraResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      descricao: "Água",
      unidadeMedida: "m3",
      valorUnidade: 0.6,
      taxaFixa: 30.4,
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
    TipoMovimentacao: {
      descricao: "Conta à pagar",
      $tipo: "S",
      $gerarCobranca: true,
    },
    TipoMovimentacaoResponse: {
      _id: "61fc6aa5b49ec355ca0300b4",
      descricao: "Conta à pagar",
      gerarCobranca: true,
      tipo: "S",
      createdAt: "2022-03-24T20:30:01",
      updatedAt: "2022-03-24T20:30:01",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, config, { language: "pt-BR" });
