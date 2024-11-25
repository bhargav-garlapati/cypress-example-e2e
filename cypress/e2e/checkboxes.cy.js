describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Checkboxes', () => {

        // Visit checkboxes page
        cy.visitPage('/checkboxes');

        // Check h3 text
        cy.get('h3')
        .contains(data.checkboxes);

        // Check checkbox1 is not checked
        cy.get('[id="checkboxes"] [type="checkbox"]').eq(0).should('not.be.checked');

        // Check checkbox2 is checked
        cy.get('[id="checkboxes"] [type="checkbox"]').eq(1).should('be.checked');
    })
})