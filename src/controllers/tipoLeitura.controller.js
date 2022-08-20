const tipoLeituraRepository = require("../repositories/tipoLeitura.repository.js");
const { LIMIT } = require("../utils/index.js");

module.exports = class TipoLeitura {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await tipoLeituraRepository.list({
        filters: { _idCondominio: user._idCondominio, ...filters },
        paginate,
      });

      /* #swagger.responses[200] = {
      description: 'Tipos de Leitura listadas com sucesso',
      schema: [{ $ref: '#/definitions/TipoLeituraResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      const result = await tipoLeituraRepository.get({
        _id: id,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Tipos de Leitura obtida com sucesso',
      schema: { 
      $ref: '#/definitions/TipoLeituraResponse'} 
      } */
      return res
      .status(result ? 200 : 400)
      .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async create(req, res) {
    const tipoLeitura = req.body;
    const { user } = req;
    try {
      const result = await tipoLeituraRepository.create({
        ...tipoLeitura,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Tipo de Leitura criada com sucesso',
      schema: { 
      $ref: '#/definitions/TipoLeituraResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const tipoLeitura = req.body;
    const { id } = req.params;
    const { user } = req;
    try {
      let filters = {
        _id: id,
        _idCondominio: user._idCondominio,
      };
      const result = await tipoLeituraRepository.update({
        filters,
        data: tipoLeitura,
      });
      /* #swagger.responses[200] = {
      description: 'Tipos de Leitura atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/TipoLeituraResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? tipoLeitura : { error: "Registro não encontrado" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { id } = req.params;
    try {
      const result = await tipoLeituraRepository.delete({ _id: id });
      /* #swagger.responses[200] = {
      description: 'Tipo de Leitura deletada com sucesso',
      schema: { message: "Tipo de Leitura deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Tipo de Leitura deletado com sucesso" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
};
