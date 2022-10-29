const request = require("supertest");
const cobrancas = require("../database/mocks/cobrancas.mock");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
let usuarioLogado;
let movimentacao;
let idCreated;
let idToDelete;

beforeEach((done) => {
  const { email } = usuarios[0];
  request(app)
    .post(`/v1/auth/login/local`)
    .send({ email, senha: "123" })
    .set("Content-type", "application/json")
    .end((err, response) => {
      token = response.body.token;
      usuarioLogado = response.body.user;
      done();
    });
});

describe("Cobranças", () => {
  test("Criar cobrança", async () => {
    [movimentacao] = await request(app)
      .post("/v1/movimentacoes/list?limit=1")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json")
      .then((response) => {
        if (response.text) {
          return response.body;
        }
      });
    let cobrancaToCreate = {
      _idUsuarioCobranca: usuarioLogado._id,
      ...cobrancas[0],
    };
    cobrancaToCreate.itemsCobranca[0]._idMovimentacao = movimentacao._id;
    return request(app)
      .post("/v1/cobrancas/create")
      .send(cobrancaToCreate)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text && response.status != 400) {
          idCreated = JSON.parse(response.text)._id;
        } else {
          console.log(response.error.text);
        }
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Atualizar cobrança", () => {
    let cobrancaToUpdate = {
      _idUsuarioCobranca: usuarioLogado._id,
      ...cobrancas[1],
    };
    cobrancaToUpdate.itemsCobranca[0]._idMovimentacao = movimentacao._id;
    return request(app)
      .put(`/v1/cobrancas/update/${idCreated}`)
      .send(cobrancaToUpdate)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter cobrança", () => {
    return request(app)
      .get(`/v1/cobrancas/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar cobrança", () => {
    return request(app)
      .post("/v1/cobrancas/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar cobrança", async () => {
    let cobrancaToDelete = {
      _idUsuarioCobranca: usuarioLogado._id,
      ...cobrancas[1],
    };
    cobrancaToDelete.itemsCobranca[0]._idMovimentacao = movimentacao._id;
    await request(app)
      .post("/v1/cobrancas/create")
      .send(cobrancaToDelete)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/cobrancas/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
