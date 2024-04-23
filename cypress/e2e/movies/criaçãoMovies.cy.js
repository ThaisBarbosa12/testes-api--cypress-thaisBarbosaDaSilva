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
  it("Não deve ser possível criar um filme com dados vazios", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeDadosVazios.json").as(
      "erroCriarFilmeDadosVazios"
    );
    cy.fixture("Movies/requests/bodyFilmeDadosVazios.json").then(
      (filmeDadosVazios) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeDadosVazios,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeDadosVazios);
        });
      }
    );
  });
  it("Não deve ser possível criar um filme sem título", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeSemTitulo.json").as(
      "erroCriarFilmeSemTitulo"
    );
    cy.fixture("Movies/requests/bodyCriarFilmeSemTitulo.json").then(
      (filmeSemTitulo) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeSemTitulo,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeSemTitulo);
        });
      }
    );
  });
  it("Não deve ser possível criar um filme sem gênero", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeSemGenero.json").as(
      "erroCriarFilmeSemGenero"
    );
    cy.fixture("Movies/requests/bodyCriarFilmeSemGenero.json").then(
      (filmeSemGenero) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeSemGenero,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeSemGenero);
        });
      }
    );
  });
  it("Não deve ser possível criar um filme sem descrição", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeSemDescrição.json").as(
      "erroCriarFilmeSemDescrição"
    );
    cy.fixture("Movies/requests/bodyCriarFilmeSemDescrição.json").then(
      (filmeSemDescrição) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeSemDescrição,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeSemDescrição);
        });
      }
    );
  });
  it("Não deve ser possível criar um filme inserindo número no campo título", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeNumeroNoTitulo.json").as(
      "erroCriarFilmeNumeroNoTitulo"
    );
    cy.fixture("Movies/requests/bodyCriarFilmeNumeroNoTitulo.json").then(
      (filmeNumeroNoTitulo) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeNumeroNoTitulo,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(
            this.erroCriarFilmeNumeroNoTitulo
          );
        });
      }
    );
  });
  it("Não deve ser possível criar um filme inserindo string no campo releaseYear", function () {
    cy.fixture("Movies/responses/bodyErroCriarFilmeStringNoYear.json").as(
      "erroCriarFilmeStringNoYear"
    );
    cy.fixture("Movies/requests/bodyCriarFilmeStringNoYear.json").then(
      (filmeStringNoYear) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: filmeStringNoYear,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroCriarFilmeStringNoYear);
        });
      }
    );
  });
});
