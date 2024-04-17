import { faker } from '@faker-js/faker';

const namefaker = faker.internet.userName()
const emailfaker = faker.internet.email()

describe('Criar usuario com dados válidos', function () {
    it('Criar novo usuario', function () {
      cy.request({
        method: 'POST',
        url: '/users',
        body: {
         "name": namefaker,
         "email": emailfaker,
         "password": "123456"
         }
        })
        .then(function (response) {                            
           expect(response.status).to.equal(201);
           expect(typeof response.body.id).to.equal("number");
           expect(typeof response.body.name).to.equal("string");
           expect(response.body.active).to.equal(true);
           expect(response.body.type).to.equal(0);
           expect(response.body).to.deep.include({
                name: namefaker,
                email: emailfaker
             });
         });
    });
});

before(function () {
    cy.fixture("Responses/bodyEmailEmUso").as("conflitoEmail");
    cy.fixture("Responses/bodySenhaMenos6Carac").as("respSenhaMenos6Carac");
    cy.fixture("Responses/bodySenhaMais12Carac").as("respSenhaMais12Carac")
})
describe('Criar usuario com dados inválidos', function () {    
    it('Criar usuario com email ja existente', function () {
        cy.request({
          method: 'POST',
          url: '/users',
          body: {
           "name": namefaker,
           "email": emailfaker,
           "password": "123456"
           },
           failOnStatusCode: false
        })
        .then(function (response) {                            
            expect(response.status).to.equal(409);
            expect(response.body).to.deep.equal(
                this.conflitoEmail
            );  
        });     
    });

    it('Criar senha com < 6 caracteres', function () {
        cy.request({
          method: 'POST',
          url: '/users',
          body: {
           "name": namefaker,
           "email": emailfaker,
           "password": "12345"
           },
           failOnStatusCode: false
        })
        .then(function (response) {                            
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal(
                this.respSenhaMenos6Carac
            );  
        });     
    });

    it('Criar senha > 12 caracteres', function () {
        cy.request({
          method: 'POST',
          url: '/users',
          body: {
           "name": namefaker,
           "email": emailfaker,
           "password": "1234567891011"
           },
           failOnStatusCode: false
        })
        .then(function (response) {                            
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal(
                this.respSenhaMais12Carac
            );  
        });     
    });
})
