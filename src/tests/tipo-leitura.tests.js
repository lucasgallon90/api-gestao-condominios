const request = require("supertest");
const tiposLeitura = require("../database/mocks/tiposLeitura.mock");
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

describe("Tipos de Leitura", () => {
  test("Criar tipo de leitura", () => {
    return request(app)
      .post("/v1/tipos-leitura/create")
      .send(tiposLeitura[0])
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

  test("Atualizar tipo de leitura", () => {
    return request(app)
      .put(`/v1/tipos-leitura/update/${idCreated}`)
      .send(tiposLeitura[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter tipo de leitura", () => {
    return request(app)
      .get(`/v1/tipos-leitura/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar tipos de leitura", () => {
    return request(app)
      .post("/v1/tipos-leitura/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar tipo de leitura", async () => {
    await request(app)
      .post("/v1/tipos-leitura/create")
      .send(tiposLeitura[1])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/tipos-leitura/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
