const ocorrenciaRepository = require("../repositories/ocorrencia.repository.js");
const { LIMIT } = require("../utils/index.js");
const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");

module.exports = class Ocorrencia {
  static async list(req, res) {
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        filters._idUsuarioOcorrencia = ObjectId(user._id);
      }
      let paginate = {};
      if (page && limit) {
        paginate = [
          { $skip: limit * (page - 1) },
          { $limit: limit },
          { $sort: { createdAt: -1 } },
        ];
      }
      filters.motivo && (filters.motivo = { $regex: `.*${filters.motivo}.*` });
      filters.createdAt &&
        (filters.createdAt = {
          $gte: moment(filters.createdAt).startOf("day").toDate(),
          $lte: moment(filters.createdAt).endOf("day").toDate(),
        });
      let afterLookupFilter = null;
      if (filters.nomeMorador) {
        afterLookupFilter = {
          $match: {
            "usuarioOcorrencia.nome": { $regex: `.*${filters.nomeMorador}.*` },
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
            localField: "_idUsuarioOcorrencia",
            foreignField: "_id",
            as: "usuarioOcorrencia",
          },
        },
        {
          $unwind: {
            path: "$usuarioOcorrencia",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...paginate,
      ];
      if (afterLookupFilter) {
        pipeline.push(afterLookupFilter);
      }
      const results = await ocorrenciaRepository.list(pipeline);
      /* #swagger.responses[200] = {
      description: 'Ocorrências listadas com sucesso',
      schema: [{ $ref: '#/definitions/OcorrenciaResponse'}]
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
      let filters = {};

      if (user.tipoUsuario != "admin") {
        filters._idUsuarioOcorrencia = ObjectId(user._id);
      }

      const [result] = await ocorrenciaRepository.get([
        {
          $match: {
            _id: ObjectId(id),
            _idCondominio: ObjectId(user._idCondominio),
            ...filters,
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_idUsuarioOcorrencia",
            foreignField: "_id",
            as: "usuarioOcorrencia",
          },
        },
        {
          $unwind: {
            path: "$usuarioOcorrencia",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      /* #swagger.responses[200] = {
      description: 'Ocorrência obtida com sucesso',
      schema: { 
      $ref: '#/definitions/OcorrenciaResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getTotal(req, res) {
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        return res.status(401).json({ error: "Usuário não tem permissão" });
      }
      const result = await ocorrenciaRepository.getTotal({
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Total de ocorrências obtido com sucesso',
      schema: { 
      total: 1
      }
     } */
      return res.json({ total: result || 0 });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const ocorrencia = req.body;
    const { user } = req;
    try {
      if (user.tipoUsuario != "admin") {
        ocorrencia._idUsuarioOcorrencia = user._id;
      }
      const result = await ocorrenciaRepository.create({
        ...ocorrencia,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Ocorrência criada com sucesso',
      schema: { 
      $ref: '#/definitions/OcorrenciaResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const ocorrencia = req.body;
    const { user } = req;
    try {
      let filters = {
        _id: id,
        _idCondominio: user._idCondominio,
        _idUsuarioOcorrencia: ocorrencia._idUsuarioOcorrencia,
      };
      if (user.tipoUsuario != "admin") {
        filters._idUsuarioOcorrencia = user._id;
      }
      const result = await ocorrenciaRepository.update({
        filters,
        data: ocorrencia,
      });
      /* #swagger.responses[200] = {
      description: 'Ocorrência atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/OcorrenciaResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? ocorrencia : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async remove(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      let filters = { _id: id, _idCondominio: user._idCondominio };
      if (user.tipoUsuario != "admin") {
        filters._idUsuarioOcorrencia = user._id;
      }
      const result = await ocorrenciaRepository.delete(filters);
      /* #swagger.responses[200] = {
      description: 'Ocorrência deletada com sucesso',
      schema: { message: "Ocorrência deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Ocorrência deletada com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
