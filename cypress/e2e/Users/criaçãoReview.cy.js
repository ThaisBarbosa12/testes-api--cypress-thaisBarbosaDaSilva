import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Criação de Review", function () {
  var novoUsuario;
  var token;
  var movieId;

  before(function () {
    cy.criarUsuario().then((dados) => {
      novoUsuario = dados;
    });
    cy.logarUsuario().then((response) => {
      token = response.body.accessToken;
    });
    cy.promoverUsuarioAdmin().then(function () {
      cy.criarFilme().then(function (response) {
        movieId = response.body.id;
      });
    });
  });
  after(function () {
    cy.deletarFilme(movieId);
    cy.deletarUsuario(novoUsuario.id);
  });

  it("Deve ser possivel criar uma review com dados válidos", function () {
    cy.request({
      method: "POST",
      url: "/users/review",
      body: {
        movieId: movieId,
        score: 4,
        reviewText: "Não são furiosos, mas sim velozes",
      },
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(function (response) {
      expect(response.status).to.equal(201);
      expect(response.headers).to.have.property("access-control-allow-origin");
      expect(response.headers).to.have.property("connection");
      expect(response.headers).to.have.property("content-length");
      expect(response.headers).to.have.property("date");
      expect(response.headers).to.have.property("nel");
      expect(response.headers).to.have.property("report-to");
      expect(response.headers).to.have.property("reporting-endpoints");
      expect(response.headers).to.have.property("server");
      expect(response.headers).to.have.property("via");
      expect(response.headers).to.have.property("x-powered-by");
    });
  });
  it("Não deve ser possivel criar uma review com dados nulos", function () {
    cy.request({
      method: "POST",
      url: "/users/review",
      body: {
        movieId: movieId,
        score: null,
        reviewText: " ",
      },
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false,
    }).then(function (response) {
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Bad Request");
      expect(response.body).to.have.property("message");
    });
  });
  it("Não deve ser possivel criar uma review com score > que 5", function () {
    cy.request({
      method: "POST",
      url: "/users/review",
      body: {
        movieId: movieId,
        score: 6,
        reviewText: "Não são furiosos, mas sim velozes",
      },
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false,
    }).then(function (response) {
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Bad Request");
      expect(response.body.message).to.deep.equal(
        "Score should be between 1 and 5"
      );
    });
  });
  it("Não deve ser possivel criar uma review com score < que 1", function () {
    cy.request({
      method: "POST",
      url: "/users/review",
      body: {
        movieId: movieId,
        score: 0,
        reviewText: "Não são furiosos, mas sim velozes",
      },
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false,
    }).then(function (response) {
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Bad Request");
      expect(response.body.message).to.deep.equal(
        "Score should be between 1 and 5"
      );
    });
  });
});
