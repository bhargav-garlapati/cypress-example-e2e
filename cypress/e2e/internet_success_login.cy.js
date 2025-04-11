describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Successfully loads the-internet login page', 
       { tags: ['authentication', 'login'] }, 
       () => {

        // Visit login page
        cy.visitPage('/login');

        // Enter Username
        cy.get('#username')
            .type(`${Cypress.env("USERNAME")}`);

        // Enter Password
        cy.get('#password')
            .type(`${Cypress.env("PASSWORD")}`);

        // Click Submit button         
        cy.get('[type="submit"]')
            .click();

        // Check welcome text
        cy.get('h4')
            .contains(data.secureAreaMessage);

        // Click logout button
        cy.get('[href="/logout"]')
            .click();

        // Check Login page text
        cy.get('h2')
            .contains(data.loginPageMessage);
        // cy.get('[name="q"]').compareSnapshot('googleTest', 0.2, { limit: 6, delay: 1000 });
    })
})
