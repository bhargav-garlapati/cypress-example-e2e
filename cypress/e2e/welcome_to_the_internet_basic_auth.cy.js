describe('Basic Auth Testing', () => {
    const data = require('../fixtures/content.json');

    it('Successfully loads the-internet.herokuapp.com and test basic auth', () => {
        cy.visitPage('/basic_auth');
        cy.get('h3')
        .contains(data.basicAuth)
        cy.get('p')
        .contains(data.basicAuthMessage);
    })
  })