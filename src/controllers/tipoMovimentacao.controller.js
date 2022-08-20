const tipoMovimentacaoRepository = require("../repositories/tipoMovimentacao.repository.js");
const { LIMIT } = require("../utils/index.js");

module.exports = class TipoMovimentacao {
  static async list(req, res) {
    const { filters } = req.body;
    const { page = 1, limit = LIMIT } = req.query;
    const { user } = req;
    try {
      const results = await tipoMovimentacaoRepository.list({
        filters: { _idCondominio: user._idCondominio, ...filters },
        page,
        limit,
      });
      /* #swagger.responses[200] = {
      description: 'Tipos de Movimentação listadas com sucesso',
      schema: [{ $ref: '#/definitions/TipoMovimentacaoResponse'}]
      } */
      return res.json(results);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async get(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const result = await tipoMovimentacaoRepository.get({
        _id: id,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Tipos de Movimentação obtida com sucesso',
      schema: { 
      $ref: '#/definitions/TipoMovimentacaoResponse'} 
      } */
      return res
      .status(result ? 200 : 400)
      .json(result ? result : { error: "Registro não encontrado" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async create(req, res) {
    const { user } = req;
    const tipoMovimentacao = req.body;
    try {
      const result = await tipoMovimentacaoRepository.create({
        ...tipoMovimentacao,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Tipo de Movimentação criada com sucesso',
      schema: { 
      $ref: '#/definitions/TipoMovimentacaoResponse'} 
      } */
      return res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  static async update(req, res) {
    const { user } = req;
    const tipoMovimentacao = req.body;
    const { id } = req.params;
    try {
      let filters = {
        _id: id,
        _idCondominio: user._idCondominio,
      };
      const result = await tipoMovimentacaoRepository.update({
        filters,
        data: tipoMovimentacao,
      });
      /* #swagger.responses[200] = {
      description: 'Tipos de Movimentação atualizada com sucesso',
      schema: { 
      $ref: '#/definitions/TipoMovimentacaoResponse'} 
      } */
      return res
        .status(result ? 200 : 400)
        .json(result ? tipoMovimentacao : { error: "Registro não encontrado" });
    } catch (error) {
        res.status(400).json(error);
    }
  }
  static async remove(req, res) {
    const { user } = req;
    const { id } = req.params;
    try {
      const result = await tipoMovimentacaoRepository.delete({
        _id: id,
        _idCondominio: user._idCondominio,
      });
      /* #swagger.responses[200] = {
      description: 'Tipo de Movimentação deletada com sucesso',
      schema: { message: "Tipo de Movimentação deletada com sucesso" }
      } */
      if (!result) {
        return res.status(400).json({ error: "Registro não encontrado" });
      }
      return res.json({ message: "Tipo de Movimentação deletado com sucesso" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
};
