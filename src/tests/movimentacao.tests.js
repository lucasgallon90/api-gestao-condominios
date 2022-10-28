const request = require("supertest");
const movimentacoes = require("../database/mocks/movimentacoes.mock");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
let usuarioLogado;
let tipoMovimentacao;
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

describe("Movimentações", () => {
  test("Criar movimentação", async () => {
    [tipoMovimentacao] = await request(app)
      .post("/v1/tipos-movimentacao/list?limit=1")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json")
      .then((response) => {
        if (response.text) {
          return response.body;
        }
      });
    return request(app)
      .post("/v1/movimentacoes/create")
      .send({
        _idTipoMovimentacao: tipoMovimentacao._id,
        ...movimentacoes[0],
      })
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

  test("Atualizar movimentação", () => {
    return request(app)
      .put(`/v1/movimentacoes/update/${idCreated}`)
      .send({
        _idTipoMovimentacao: tipoMovimentacao._id,
        ...movimentacoes[0],
      })
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter movimentação", () => {
    return request(app)
      .get(`/v1/movimentacoes/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar movimentação", () => {
    return request(app)
      .post("/v1/movimentacoes/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar movimentação", async () => {
    await request(app)
      .post("/v1/movimentacoes/create")
      .send({
        _idTipoMovimentacao: tipoMovimentacao._id,
        ...movimentacoes[1],
      })
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/movimentacoes/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
