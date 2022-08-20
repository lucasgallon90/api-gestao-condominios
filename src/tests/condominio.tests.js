const request = require("supertest");
const condominios = require("../database/mocks/condominios.mock");
const app = require("../app");
let token;
let idCreated;
let idToDelete;

beforeEach((done) => {
  request(app)
    .post(`/v1/auth/login/local`)
    .send({ email: "superadmin@gestaodecondominios.com.br", senha: "123" })
    .set("Content-type", "application/json")
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Condomínios", () => {
  test("Criar condomínio", () => {
    return request(app)
      .post("/v1/condominios/create")
      .send(condominios[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idCreated = JSON.parse(response.text)._id;
        }
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Atualizar condomínio", () => {
    return request(app)
      .put(`/v1/condominios/update/${idCreated}`)
      .send(condominios[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter condomínio", () => {
    return request(app)
      .get(`/v1/condominios/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar condomínios", () => {
    return request(app)
      .post("/v1/condominios/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar condomínio", async () => {
    await request(app)
      .post("/v1/condominios/create")
      .send(condominios[1])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/condominios/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
