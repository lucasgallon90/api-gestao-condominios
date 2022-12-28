const request = require("supertest");
const usuarios = require("../database/mocks/usuarios.mock");
const app = require("../app");
let token;

beforeEach((done) => {
  request(app)
    .post(`/v1/auth/login/local`)
    .send({ email: usuarios[0].email, senha: "123" })
    .set("Content-type", "application/json")
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Gráficos", () => {
  test("Total caixa período", () => {
    return request(app)
      .post("/v1/caixa/total-periodo")
      .send({ dataInicial: "2022-01-01", dataFinal: "2022-12-31" })
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
