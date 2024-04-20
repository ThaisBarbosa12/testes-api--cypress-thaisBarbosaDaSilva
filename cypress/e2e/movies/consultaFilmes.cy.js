import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();
var tokenUsuario;
let idFilme;
let ultimoFilme;

describe("Validar Consulta de filmes", function () {
  before(function () {
    cy.request({
      method: "POST",
      url: "/users",
      body: {
        name: namefaker,
        email: emailfaker,
        password: "123456",
      },
    });
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        email: emailfaker,
        password: "123456",
      },
    }).then(function (response) {
      tokenUsuario = response.body.accessToken;
      cy.request({
        method: "PATCH",
        url: "/users/admin",
        headers: {
          Authorization: "Bearer " + tokenUsuario,
        },
      });
      cy.request({
        method: "POST",
        url: "/movies",
        body: {
          title: "Velozes e Furiosos 10",
          genre: "Ação",
          description: "O fim da estrada esta chegando",
          durationInMinutes: 140,
          releaseYear: 2023,
        },
        headers: {
          Authorization: "Bearer " + tokenUsuario,
        },
      });
    });
  });
  it("Consultar por lista de filmes", function () {
    cy.request({
      method: "GET",
      url: "/movies",
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      const listaDeFilmes = response.body;
      ultimoFilme = listaDeFilmes[listaDeFilmes.length - 1];
      cy.log(ultimoFilme);
    });
  });
  it("Consultar filme por id", function () {
    cy.request({
      method: "GET",
      url: "/movies/" + ultimoFilme.id,
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.be.an("number");
      expect(response.body.title).to.be.an("string");
      expect(response.body.description).to.be.an("string");
      expect(response.body.genre).to.be.an("string");
      expect(response.body.durationInMinutes).to.be.an("number");
      expect(response.body.releaseYear).to.be.an("number");
      expect(response.body.criticScore).to.be.an("number");
      expect(response.body.audienceScore).to.be.an("number");
    });
  });
  it("Consultar filme por título", function () {
    cy.request({
      method: "GET",
      url: "/movies/search",
      qs: { title: "Velozes e Furiosos 10" },
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });
});
