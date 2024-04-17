import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();
var tokenUsuario;
var idUsuario;

describe("Consulta de usuários", function () {
  before(function () {
    cy.request({
      method: "POST",
      url: "/users",
      body: {
        name: namefaker,
        email: emailfaker,
        password: "123456",
      },
    })
      .as("criarUsuario")
      .then(function (response) {
        idUsuario = response.body.id;
      });
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        email: emailfaker,
        password: "123456",
      },
    })
      .as("logarUsuario")
      .then(function (response) {
        tokenUsuario = response.body.accessToken;
        cy.request({
          method: "PATCH",
          url: "/users/admin",
          headers: {
            Authorization: "Bearer " + tokenUsuario,
          },
        }).as("tornarUsuarioAdmin");
      });
  });
  it("Consultar usuário por lista", function () {
    cy.request({
      method: "GET",
      url: "/users",
      headers: {
        Authorization: "Bearer " + tokenUsuario,
      },
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });
  it("Consultar usuário por Id", function () {
    cy.request({
      method: "GET",
      url: "/users/" + idUsuario,
      headers: {
        Authorization: "Bearer " + tokenUsuario,
      },
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(typeof response.body.id).to.equal("number");
      expect(typeof response.body.name).to.equal("string");
      expect(response.body.active).to.equal(true);
      expect(response.body.type).to.equal(1);
      expect(response.body).to.deep.include({
        name: namefaker,
        email: emailfaker,
      });
    });
  });
});
