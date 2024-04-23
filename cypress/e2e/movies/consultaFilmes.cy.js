import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Consulta de Filmes", function () {
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
    cy.criarReview1();
    cy.criarReview2();
    cy.criarReview3();
  });
  after(function () {
    cy.deletarFilme(movieId);
    cy.deletarUsuario(novoUsuario.id);
  });

  it("Deve ser possivel consultar uma lista de filmes", function () {
    cy.request("GET", "/movies").then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });
  it("Deve ser possivel consultar uma filme por id", function () {
    cy.log(
      "Foram criadas e executadas com sucesso 3 reviews para este filme, mas ao consultá-las na api só retornará a última criada, pois cada usuário só pode ter 1 review por filme. Quando o usuario cria uma nova review para um filme que já avaliou antes, a review original é atualizada."
    );
    cy.request({
      method: "GET",
      url: "/movies/" + movieId,
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(movieId);
      expect(response.body).to.have.property("reviews");
      expect(response.body.title).to.equal("Velozes e Furiosos 10");
      expect(response.body.description).to.equal(
        "O fim da estrada esta chegando"
      );
      expect(response.body.durationInMinutes).to.equal(140);
      expect(response.body.genre).to.equal("Ação");
      expect(response.body.releaseYear).to.equal(2023);
    });
  });
  it("Deve ser possivel consultar um filme por título", function () {
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
