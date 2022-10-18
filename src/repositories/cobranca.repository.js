const cobranca = require("../database/models/cobranca.schema.js");
const itemCobranca = require("../database/models/itemCobranca.schema.js");
const condominio = require("../database/models/condominio.schema.js");

module.exports = class Cobranca {
  static async list(filters) {
    return await cobranca.aggregate(filters);
  }
  static async get(filters) {
    return await cobranca.aggregate(filters);
  }

  static async create(data) {
    const cobrancaCreate = { ...data };
    delete cobrancaCreate.itemsCobranca;
    let cobrancaCreated = await cobranca.create(cobrancaCreate);
    let result = { ...cobrancaCreated._doc };
    if (data.itemsCobranca) {
      data.itemsCobranca?.map((itemCobranca) => {
        itemCobranca._idCobranca = cobrancaCreated._doc._id;
        itemCobranca._idCondominio = data._idCondominio;
      });
      const itemsCobrancaCreated = await itemCobranca.insertMany(
        data.itemsCobranca
      );
      result = { ...result, itemsCobranca: itemsCobrancaCreated };
    }
    return result;
  }

  static async update(data) {
    const { _id, itemsCobranca, _idCondominio, ...rest } = data;
    const result = await cobranca.findOneAndUpdate(
      { _id, _idCondominio },
      rest,
      { returnDocument: "before" }
    );
    if (!result) {
      return;
    }
    await itemCobranca.deleteMany({ _idCobranca: _id, _idCondominio });
    itemsCobranca.map((itemCobranca) => {
      itemCobranca._idCobranca = _id;
      itemCobranca._idCondominio = data._idCondominio;
    });
    const itemsCobrancaUpdate = await itemCobranca.insertMany(itemsCobranca);
    return { ...result._doc, itemsCobranca: itemsCobrancaUpdate };
  }

  static async delete({ _id, _idCondominio }) {
    await itemCobranca.deleteMany({ _idCobranca: _id, _idCondominio });
    const result = await cobranca.findOneAndDelete({ _id, _idCondominio });
    return result;
  }
};
