const leituraRepository = require("../repositories/leitura.repository.js");
const { LIMIT } = require("../utils/index.js");

module.exports = class Leitura {
  static async list(req, res) {
    const { user } = req;
    const filters = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      if (Object.keys(filters).length > 0) {
        Object.keys(filters).map(
          (key) =>
            (filters[key] = { $regex: `.*${filters[key]}.*`, $options: "i" })
        );
      }
      const results = await leituraRepository.list({
        filters: { _idCondominio: user._idCondominio, ...filters },
        paginate,
      });
      /* #swagger.responses[200] = {
      description: 'Leituras listadas com sucesso',
      schema: [{ $ref: '#/definitions/LeituraResponse'}]
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
      const filters = { _id: id, _idCondominio: user._idCondominio };
      const result = await leituraRepository.get(filters);
      /* #swagger.responses[200] = {
      description: 'Leitura obtida com sucesso',
      schema: { 
      $ref: '#/definitions/LeituraResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async create(req, res) {
    const leitura = req.body;
    const { user } = req;
    try {
      const leituraUnicaMesAno = await leituraRepository.get({
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
      res.status(400).json(error);
    }
  }
};
