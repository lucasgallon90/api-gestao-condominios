const condominioRepository = require("../repositories/condominio.repository.js");
const { LIMIT } = require("../utils/index.js");

module.exports = class Condominio {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    try {
      let paginate = {};
      if (page && limit) {
        paginate = { skip: limit * (page - 1), limit };
      }
      const results = await condominioRepository.list({
        filters,
        paginate,
      });
      /* #swagger.responses[200] = {
      description: 'Condomínios listados com sucesso',
      schema: [{ $ref: '#/definitions/CondominioResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { id } = req.params;
    try {
      const result = await condominioRepository.getById(id);
      /* #swagger.responses[200] = {
      description: 'Condomínio obtido com sucesso',
      schema: { 
      $ref: '#/definitions/CondominioResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async getByCodigo(req, res) {
    const { codigo } = req.params;
    try {
      const result = condominioRepository.getByCodigo(codigo);
      /* #swagger.responses[200] = {
      description: 'Condomínio obtido com sucesso',
      schema: { 
      _id: "61fc6aa5b49ec355ca0300b4",
      nome: "Edifício Frei Paolo II",
      codigo: "Edifício Frei Paolo II",
      }
     } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const condominio = req.body;
    try {
      const result = await condominioRepository.create(condominio);
      /* #swagger.responses[200] = {
      description: 'Condomínio criado com sucesso',
      schema: { 
      $ref: '#/definitions/CondominioResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const condominio = req.body;
    const { id } = req.params;
    try {
      condominio._id = id;
      const result = await condominioRepository.update(condominio);
      /* #swagger.responses[200] = {
      description: 'Condomínio atualizado com sucesso',
      schema: { 
      $ref: '#/definitions/CondominioResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { id } = req.params;
    try {
      const result = await condominioRepository.delete({ _id: id });
      /* #swagger.responses[200] = {
      description: 'Registro deletado com sucesso',
      schema: { message: "Condomínio deletado com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Condomínio deletado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};
