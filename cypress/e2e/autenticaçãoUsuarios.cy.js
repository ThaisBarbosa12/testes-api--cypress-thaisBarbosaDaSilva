import { faker } from '@faker-js/faker';

const namefaker = faker.internet.userName()
const emailfaker = faker.internet.email()
var tokenUsuario;

describe('Autenticar usuário', function () {
   before(function(){
     cy.request({   
        method: 'POST',
        url: '/users',
        body: {
         "name": namefaker,
         "email": emailfaker,
         "password": "123456"
        }
      }).as('novoUsuario')
    });
    it('Logar com novo usuário', function () {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {        
         "email": emailfaker,
         "password": "123456"
         }
        })
        .then(function (response) {                            
           expect(response.status).to.equal(200);
           expect(typeof response.body.accessToken).to.equal("string")
           expect(response.body.accessToken)
                tokenUsuario = response.body.accessToken;
         });
    });
})