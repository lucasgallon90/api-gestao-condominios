const cobrancaRepository = require("../repositories/cobranca.repository.js");
const condominioRepository = require("../repositories/condominio.repository.js");
const leituraRepository = require("../repositories/leitura.repository.js");
const movimentacaoRepository = require("../repositories/movimentacao.repository.js");
const usuarioRepository = require("../repositories/usuario.repository.js");
const moment = require("moment");
const { LIMIT } = require("../utils");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Cobranca {
  static async list(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = [{ $skip: limit * (page - 1) }, { $limit: limit }];
      }

      if (
        filters.dataPagamento ||
        filters.dataVencimento ||
        filters.createdAt
      ) {
        Object.keys(filters).map((key) => {
          filters[key] = {
            $gte: moment(filters[key]).startOf("day").toDate(),
            $lte: moment(filters[key]).endOf("day").toDate(),
          };
        });
      } else if (Object.keys(filters).length > 0) {
        Object.keys(filters).map(
          (key) =>
            (filters[key] = { $regex: `.*${filters[key]}.*`, $options: "i" })
        );
      }
      
      const results = await cobrancaRepository.list([
        {
          $match: { _idCondominio: ObjectId(user._idCondominio), ...filters },
        },
        {
          $lookup: {
            from: "itemsCobranca",
            localField: "_id",
            foreignField: "_idCobranca",
            as: "itemsCobranca",
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioCobranca",
            foreignField: "_id",
            as: "morador",
          },
        },
        {
          $unwind: {
            path: "$morador",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...paginate,
      ]);
      /* #swagger.responses[200] = {
      description: 'Cobranças listadas com sucesso',
      schema: [{ $ref: '#/definitions/CobrancaResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const filters = [
        {
          $match: {
            _id: ObjectId(id),
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $lookup: {
            from: "itemsCobranca",
            localField: "_id",
            foreignField: "_idCobranca",
            as: "itemsCobranca",
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioCobranca",
            foreignField: "_id",
            as: "morador",
          },
        },
        {
          $unwind: {
            path: "$morador",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const [result] = await cobrancaRepository.get(filters);
      /* #swagger.responses[200] = {
      description: 'Cobrança obtida com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async getContasMesAno(req, res) {
    const { user } = req;
    const { mesAno, _idUsuario } = req.body;
    try {
      const [usuario] = await usuarioRepository.get([
        { $match: { _id: ObjectId(_idUsuario), ativo: true } },
      ]);
      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      const data = moment(mesAno + "-01");
      const startOfMonth = moment(data).startOf("month").toDate();
      const endOfMonth = moment(data).endOf("month").toDate();
      const filters = [
        {
          $match: {
            dataVencimento: { $gte: startOfMonth, $lte: endOfMonth },
            ratear: true,
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $project: {
            _id: 0,
            _idMovimentacao: "$_id",
            descricao: 1,
            valorMovimentacao: "$valor",
          },
        },
        { $sort: { dataVencimento: 1 } },
      ];
      const contas = await movimentacaoRepository.getContasMesAno(filters);
      if (contas?.length > 0) {
        const [moradores] = await usuarioRepository.list([
          {
            $match: {
              _idCondominio: ObjectId(user._idCondominio),
              bloco: usuario.bloco,
              tipoUsuario: "morador",
              ativo: true,
            },
          },
          {
            $count: "total_moradores",
          },
        ]);
        contas.map((conta) => {
          conta.valor = parseFloat(
            (
              conta.valorMovimentacao / (moradores.total_moradores || 1)
            ).toFixed(2)
          );
        });
      }

      const leituras = await leituraRepository.list([
        {
          $match: {
            _idCondominio: ObjectId(user._idCondominio),
            _idUsuarioLeitura: ObjectId(_idUsuario),
            mesAno: mesAno,
          },
        },
        {
          $lookup: {
            from: "tiposleitura",
            localField: "_idTipoLeitura",
            foreignField: "_id",
            as: "tipoLeitura",
          },
        },
        {
          $unwind: {
            path: "$tipoLeitura",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            _idLeitura: "$_id",
            descricao: "$tipoLeitura.descricao",
            valorLeitura: "$valor",
            taxaFixa: 1,
            valor: "$valorTotal",
            unidadeMedida: "$tipoLeitura.unidadeMedida",
            leitura: { $subtract: ["$leituraAtual", "$leituraAnterior"] },
          },
        },
      ]);
      /* #swagger.responses[200] = {
      description: 'Contas e suas referidas leituras/rateios do mês/ano obtidas com sucesso',
      schema: [{ 
      $ref: '#/definitions/ContaResponse'} ]
      } */
      return res.json({ contas, leituras });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const cobranca = req.body;
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        cobranca._idUsuarioCobranca = user._id;
      }
      const result = await cobrancaRepository.create({
        ...cobranca,
        _idCondominio: user._idCondominio,
      });
      if (cobranca.dataPagamento && cobranca.valor > 0 && result) {
        await condominioRepository.update({
          _id: user._idCondominio,
          $inc: { saldoCaixaAtual: cobranca.valor },
        });
      }
      /* #swagger.responses[200] = {
      description: 'Cobrança criada com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const cobranca = req.body;
    const { user } = req;
    try {
      const result = await cobrancaRepository.update({
        _id: id,
        ...cobranca,
        _idCondominio: user._idCondominio,
      });

      if (cobranca.valor > 0 && result) {
        if (!result.dataPagamento && cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: cobranca.valor },
          });
        } else if (result.dataPagamento && !cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: -result.valor },
          });
        } else if (result.dataPagamento && cobranca.dataPagamento) {
          await condominioRepository.update({
            _id: user._idCondominio,
            $inc: { saldoCaixaAtual: cobranca.valor - result.valor },
          });
        }
      }
      /* #swagger.responses[200] = {
      description: 'Cobrança atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/CobrancaResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      let filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await cobrancaRepository.delete(filters);
      await condominioRepository.update({
        _id: user._idCondominio,
        $inc: { saldoCaixaAtual: -result.valor },
      });
      /* #swagger.responses[200] = {
      description: 'Cobrança deletada com sucesso',
      schema: { message: "Cobrança deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Cobrança deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
