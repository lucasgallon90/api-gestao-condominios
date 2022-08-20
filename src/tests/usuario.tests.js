const request = require("supertest");
const usuarios = require("../database/mocks/usuarios.mock");
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

describe("Usuários", () => {
  test("Criar usuário", () => {
    return request(app)
      .post("/v1/usuarios/create")
      .send(usuarios[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idCreated = JSON.parse(response.text)._id;
        }
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Atualizar usuário", () => {
    return request(app)
      .put(`/v1/usuarios/update/${idCreated}`)
      .send(usuarios[0])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter usuário", () => {
    return request(app)
      .get(`/v1/usuarios/${idCreated}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Dados do usuário logado", () => {
    return request(app)
      .get(`/v1/auth/user-info`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Listar usuários", () => {
    return request(app)
      .post("/v1/usuarios/list")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar usuário", async () => {
    await request(app)
      .post("/v1/usuarios/create")
      .send(usuarios[1])
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/usuarios/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
