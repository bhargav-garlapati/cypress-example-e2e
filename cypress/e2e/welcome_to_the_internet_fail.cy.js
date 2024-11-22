describe.skip('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Successfully loads the-internet page: Fail assertion', () => {
        cy.visitPage('/');
        cy.get('h1')
        .contains(data.welcomeToTheInternet);
        // cy.get('[name="q"]').compareSnapshot('googleTest', 0.2, { limit: 6, delay: 1000 });
    })
  })