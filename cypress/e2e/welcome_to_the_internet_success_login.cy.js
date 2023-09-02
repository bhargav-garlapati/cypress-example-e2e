describe('Welcome to the-internet', () => {

    it('Successfully loads the-internet login page', () => {

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
            .contains('Welcome to the Secure Area. When you are done click logout below');

        // Click logout button
        cy.get('[href="/logout"]')
            .click();

        // Check Login page text
        cy.get('h2')
            .contains('Login Page');
        // cy.get('[name="q"]').compareSnapshot('googleTest', 0.2, { limit: 6, delay: 1000 });
    })
})