import { faker } from "@faker-js/faker";
const namefaker = faker.internet.userName();
const emailfaker = faker.internet.email();
var token;
var id;
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

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
  return cy.request({
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
