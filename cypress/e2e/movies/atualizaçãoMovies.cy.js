import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Atualização de filmes", function () {
  var novoUsuario;
  var token;
  let ultimoFilme;

  before(function () {
    cy.criarUsuario().then((dados) => {
      novoUsuario = dados;
    });
    cy.logarUsuario().then((response) => {
      token = response.body.accessToken;
    });
    cy.promoverUsuarioAdmin();
    cy.criarFilme();
  });
  after(function () {
    cy.deletarUsuario(novoUsuario.id);
  });

  it("Deve ser possível buscar por uma lista de filmes e encontrar o id do ultimo filme", function () {
    cy.request("GET", "/movies").then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      const listaDeFilmes = response.body;
      ultimoFilme = listaDeFilmes[listaDeFilmes.length - 1];
      cy.log(ultimoFilme);
    });
  });
  it("Deve ser possivel atualizar um filme por id", function () {
    cy.fixture("Movies/requests/bodyAtualizarFilme.json").then(
      (atualizarFilme) => {
        cy.request({
          method: "PUT",
          url: "/movies/" + ultimoFilme.id,
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
});
