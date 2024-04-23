import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Atualização de filmes", function () {
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
  it("Deve ser possivel atualizar um filme com id válido", function () {
    cy.fixture("Movies/requests/bodyAtualizarFilme.json").then(
      (atualizarFilme) => {
        cy.request({
          method: "PUT",
          url: "/movies/" + movieId,
          body: atualizarFilme,
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then(function (response) {
          expect(response.status).to.equal(204);
          expect(response.headers).to.have.property(
            "access-control-allow-origin"
          );
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
      }
    );
  });
  it("Não deve ser possivel atualizar um filme com dados nulos", function () {
    cy.fixture("Movies/responses/bodyErroAtualizarFilmeNulo").as(
      "erroAtualizarFilmeNulo"
    );
    cy.fixture("Movies/requests/bodyAtualizarFilmeNulo.json").then(
      (atualizarFilmeNulo) => {
        cy.request({
          method: "PUT",
          url: "/movies/" + movieId,
          body: atualizarFilmeNulo,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(400);
          expect(response.body).to.deep.equal(this.erroAtualizarFilmeNulo);
        });
      }
    );
  });
});
