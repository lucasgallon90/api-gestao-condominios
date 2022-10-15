const request = require("supertest");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;
let idUsuario;
let idToDelete;

beforeEach((done) => {
  const { email } = usuarios[0];
  request(app)
    .post(`/v1/auth/login/local`)
    .send({ email, senha: "123" })
    .set("Content-type", "application/json")
    .end((err, response) => {
      idUsuario = response.body.user?._id;
      token = response.body.token;
      done();
    });
});

describe("Moradores", () => {
  test("Listar moradores", () => {
    return request(app)
      .post("/v1/usuarios/list/moradores")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Atualizar morador", () => {
    const { senha, tipoUsuario, _idCondominio, ativo, ...rest } = usuarios[0];
    return request(app)
      .put(`/v1/usuarios/moradores/update/${idUsuario}`)
      .send(rest)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Obter morador", () => {
    return request(app)
      .get(`/v1/usuarios/moradores/${idUsuario}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });

  test("Deletar morador", async () => {
    let tokenSuperAdmin;
    await request(app)
      .post(`/v1/auth/login/local`)
      .send({ email: "superadmin@gestaodecondominios.com.br", senha: "123" })
      .set("Content-type", "application/json")
      .then((response) => {
        tokenSuperAdmin = response.body.token;
      });
    await request(app)
      .post("/v1/usuarios/create")
      .send(usuarios[1])
      .set("Authorization", `Bearer ${tokenSuperAdmin}`)
      .then((response) => {
        if (response.text) {
          idToDelete = JSON.parse(response.text)._id;
        }
      });
    return (res = await request(app)
      .delete(`/v1/usuarios/moradores/delete/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      }));
  });
});
