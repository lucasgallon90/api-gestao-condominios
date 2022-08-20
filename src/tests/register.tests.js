const request = require("supertest");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");

describe("Registrar", () => {
  test("Registrar novo usuário", async () => {
    let {_idCondominio, ...rest} = usuarios[0];
    rest.codigoCondominio = "condominio1";
    rest.email = "novousuario@gestaocondominios.com"
    return request(app)
      .post("/v1/auth/register")
      .send(rest)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
