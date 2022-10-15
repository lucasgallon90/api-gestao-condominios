const usuario = require("../database/models/usuario.schema.js");
const supertest = require("supertest");
const app = require("../app");

beforeAll(async () => {
  const res = await usuario.create({
    nome: "Super Admin",
    email: "superadmin@gestaodecondominios.com.br",
    senha: "123",
    apto: "402",
    bloco: "A",
    tipoUsuario: "superAdmin",
    ativo: true,
  });
});

describe("Cadastro Inicial - Super Administrador", () => {


  it("Realizar login com o super admin", async () => {
    const res = await supertest(app)
      .post(`/v1/auth/login/local`)
      .send({ email: "superadmin@gestaodecondominios.com.br", senha: "123" })
      .set("Content-type", "application/json");
    expect(res.statusCode).toBe(200);
  });
});
