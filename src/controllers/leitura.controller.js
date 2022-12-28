const moment = require("moment/moment.js");
const leituraRepository = require("../repositories/leitura.repository.js");
const { LIMIT } = require("../utils/index.js");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Leitura {
  static async list(req, res) {
    const { user } = req;
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let afterLookupFilter = null;
      if (filters.nomeMorador) {
        afterLookupFilter = {
          $match: {
            "morador.nome": { $regex: `.*${filters.nomeMorador}.*` },
          },
        };
        delete filters.nomeMorador;
      }

      let pipeline = [
        {
          $match: { _idCondominio: ObjectId(user._idCondominio), ...filters },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioLeitura",
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
      ];
      const totalPipeline = {
        $facet: {
          paginatedResults: [
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      };
      if (afterLookupFilter) {
        pipeline.push(afterLookupFilter);
      }
      pipeline.push(totalPipeline);
      const [results] = await leituraRepository.list(pipeline);

      const totalCount = results?.totalCount[0]?.count || 0;

      res.setHeader("X-Total-Count", totalCount);
      /* #swagger.responses[200] = {
      description: 'Leituras listados com sucesso',
      schema: [{ $ref: '#/definitions/LeituraResponse'}]
      } */
      return res
        .status(results?.paginatedResults ? 200 : 204)
        .json(results?.paginatedResults);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const [result] = await leituraRepository.get([
        {
          $match: {
            _id: ObjectId(id),
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioLeitura",
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
      ]);
      /* #swagger.responses[200] = {
      description: 'Leitura obtida com sucesso',
      schema: { 
      $ref: '#/definitions/LeituraResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getLeituraAnterior(req, res) {
    const { user } = req;
    const { idUsuario } = req.params;
    try {
      const [result] = await leituraRepository.get([
        {
          $match: {
            _idUsuarioLeitura: ObjectId(idUsuario),
            _idCondominio: ObjectId(user._idCondominio),
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioLeitura",
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
        { $sort: { mesAno: -1 } },
        { $limit: 1 },
      ]);
      /* #swagger.responses[200] = {
      description: 'Leitura obtida com sucesso',
      schema: { 
      $ref: '#/definitions/LeituraResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const leitura = req.body;
    const { user } = req;
    try {
      const leituraUnicaMesAno = await leituraRepository.findUnique({
        _idTipoLeitura: leitura._idTipoLeitura,
        _idUsuarioLeitura: leitura._idUsuarioLeitura,
        _idCondominio: user._idCondominio,
        mesAno: leitura.mesAno,
      });
      if (leituraUnicaMesAno) {
        return res.status(400).json({
          message: "Leitura já cadastrada para o mês/ano",
          _idLeitura: leituraUnicaMesAno._id,
        });
      }
      const result = await leituraRepository.create({
        ...leitura,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Leitura criada com sucesso',
      schema: { 
      $ref: '#/definitions/LeituraResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const leitura = req.body;
    const { user } = req;
    try {
      const filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await leituraRepository.update({
        filters,
        data: leitura,
      });
      /* #swagger.responses[200] = {
      description: 'Leitura atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/LeituraResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? leitura : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      let filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await leituraRepository.delete(filters);
      /* #swagger.responses[200] = {
      description: 'Leitura deletada com sucesso',
      schema: { message: "Leitura deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Leitura deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
