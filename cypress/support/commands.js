import { faker } from "@faker-js/faker";
const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();
var token;
var id;
var ultimoFilme;
var movieId;

Cypress.Commands.add("criarUsuario", function () {
  return cy
    .request("POST", "/users", {
      name: namefaker,
      email: emailfaker,
      password: "123456",
    })
    .then((response) => {
      return response.body;
      id = response.body.id;
    });
});
Cypress.Commands.add("logarUsuario", function () {
  return cy
    .request("POST", "/auth/login", {
      email: emailfaker,
      password: "123456",
    })
    .then((response) => {
      token = response.body.accessToken;
    });
});
Cypress.Commands.add("promoverUsuarioAdmin", function () {
  return cy.request({
    method: "PATCH",
    url: "/users/admin",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});
Cypress.Commands.add("criarFilme", function () {
  return cy
    .request({
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
    })
    .then(function (response) {
      movieId = response.body.id;
    });
});
Cypress.Commands.add("criarReview1", function () {
  return cy.request({
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
  });
});
Cypress.Commands.add("criarReview2", function () {
  return cy.request({
    method: "POST",
    url: "/users/review",
    body: {
      movieId: movieId,
      score: 5,
      reviewText: "Realmente são muito furiosos e velozes",
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});
Cypress.Commands.add("criarReview3", function () {
  return cy.request({
    method: "POST",
    url: "/users/review",
    body: {
      movieId: movieId,
      score: 2,
      reviewText: "Não são furiosos, nem velozes",
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});
Cypress.Commands.add("deletarUsuario", function (id) {
  cy.request({
    method: "DELETE",
    url: "users/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});
Cypress.Commands.add("deletarFilme", function (movieId) {
  cy.request({
    method: "DELETE",
    url: "movies/" + movieId,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});
