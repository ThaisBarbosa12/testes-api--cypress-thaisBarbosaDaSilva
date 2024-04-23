import { faker } from "@faker-js/faker";

const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();

describe("Consulta de Review", function () {
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

  it("Deve ser possivel consultar lista de reviews criadas pelo usuario", function () {
    cy.log(
      "Foram criadas e executadas com sucesso 3 reviews para este filme, mas ao consultá-las na api só retornará a última criada, pois cada usuário só pode ter 1 review por filme. Quando o usuario cria uma nova review para um filme que já avaliou antes, a review original é atualizada."
    );
    cy.request({
      method: "GET",
      url: "/users/review/all",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body[0].id).to.be.an("number");
      expect(response.body[0].movieId).to.equal(movieId);
      expect(response.body[0].movieTitle).to.equal("Velozes e Furiosos 10");
      expect(response.body[0].score).to.be.an("number");
      expect(response.body[0].reviewText).to.be.an("string");
      expect(response.body[0].reviewType).to.be.an("number");
    });
  });
  it("Não deve ser possivel consultar um lista de reviews criadas pelo usuario sem o token de autorização", function () {
    cy.request({
      method: "GET",
      url: "/users/review/all",
      failOnStatusCode: false,
      //   headers: {
      //     Authorization: "Bearer " + token,
      //   },
    }).then(function (response) {
      expect(response.status).to.equal(401);
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
});
