describe('Basic Auth Testing', () => {
    const data = require('../fixtures/content.json');

    it('Successfully loads the-internet.herokuapp.com and test basic auth', () => {

        // Visit basic_auth page
        cy.visitPage('/basic_auth');

        // Check h3 text
        cy.get('h3')
        .contains(data.basicAuth);

        // Check basic auth message
        cy.get('p')
        .contains(data.basicAuthMessage);
    })
  })