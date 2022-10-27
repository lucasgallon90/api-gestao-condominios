const request = require("supertest");
const tiposMovimentacao = require("../database/mocks/tiposMovimentacao.mock");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
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
      done();
    });
});

describe("Tipos de Movimentação", () => {
  test("Criar tipo de movimentação", () => {
    return request(app)
      .post("/v1/tipos-movimentacao/create")
      .send(tiposMovimentacao[0])
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

  test("Atualizar tipo de movimentação", () => {
    return request(app)
      .put(`/v1/tipos-movimentacao/update/${idCreated}`)
      .send(tiposMovimentacao[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter tipo de movimentação", () => {
    return request(app)
      .get(`/v1/tipos-movimentacao/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar tipos de movimentação", () => {
    return request(app)
      .post("/v1/tipos-movimentacao/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar tipo de movimentação", async () => {
    await request(app)
      .post("/v1/tipos-movimentacao/create")
      .send(tiposMovimentacao[1])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/tipos-movimentacao/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
