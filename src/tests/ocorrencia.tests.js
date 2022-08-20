const request = require("supertest");
const ocorrencias = require("../database/mocks/ocorrencias.mock");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
let idCreated;
let idToDelete;

beforeEach((done) => {
  const { email, senha } = usuarios[0];
  request(app)
    .post(`/v1/auth/login/local`)
    .send({ email, senha })
    .set("Content-type", "application/json")
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Ocorrências", () => {
  test("Criar ocorrência", () => {
    return request(app)
      .post("/v1/ocorrencias/create")
      .send(ocorrencias[0])
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

  test("Atualizar ocorrência", () => {
    return request(app)
      .put(`/v1/ocorrencias/update/${idCreated}`)
      .send(ocorrencias[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter ocorrência", () => {
    return request(app)
      .get(`/v1/ocorrencias/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar ocorrências", () => {
    return request(app)
      .post("/v1/ocorrencias/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar ocorrência", async () => {
    await request(app)
      .post("/v1/ocorrencias/create")
      .send(ocorrencias[1])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/ocorrencias/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
