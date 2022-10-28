const request = require("supertest");
const leituras = require("../database/mocks/leituras.mock");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
let usuarioLogado;
let tipoLeitura;
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

describe("Leituras", () => {
  test("Criar leitura", async () => {
    [tipoLeitura] = await request(app)
      .post("/v1/tipos-leitura/list?limit=1")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json")
      .then((response) => {
        if (response.text) {
          return response.body;
        }
      });
    return request(app)
      .post("/v1/leituras/create")
      .send({
        _idTipoLeitura: tipoLeitura._id,
        _idUsuarioLeitura: usuarioLogado._id,
        ...leituras[0],
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

  test("Atualizar leitura", () => {
    return request(app)
      .put(`/v1/leituras/update/${idCreated}`)
      .send({
        _idTipoLeitura: tipoLeitura._id,
        _idUsuarioLeitura: usuarioLogado._id,
        ...leituras[0],
      })
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter leitura", () => {
    return request(app)
      .get(`/v1/leituras/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar leituras", () => {
    return request(app)
      .post("/v1/leituras/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar leitura", async () => {
    await request(app)
      .post("/v1/leituras/create")
      .send({
        _idTipoLeitura: tipoLeitura._id,
        _idUsuarioLeitura: usuarioLogado._id,
        ...leituras[1],
      })
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/leituras/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        console.log(response);
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
