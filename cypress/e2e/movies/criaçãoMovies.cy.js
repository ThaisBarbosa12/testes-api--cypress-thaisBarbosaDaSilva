import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Criação de filmes", function () {
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
    cy.promoverUsuarioAdmin();
  });

  after(function () {
    cy.deletarFilme(movieId);
    cy.deletarUsuario(novoUsuario.id);
  });

  it("Deve ser possível criar um filme com dados válidos", function () {
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
        Authorization: "Bearer " + token,
      },
    }).then(function (response) {
      cy.log(response);
      movieId = response.body.id;
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
  it("Não deve ser possível criar um filme com dados nulos", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeInvalido").as(
      "erroCriarFilmeInvalido"
    );
    cy.fixture("Movies/requests/bodyFilmeInvalido.json").then(
      (filmeInvalido) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeInvalido,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeInvalido);
        });
      }
    );
  });
});
