describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('UI Test using Dynamic content', () => {

        // Visit dynamic_content page
        cy.visitPage('/dynamic_content?with_content=static');

        // Check h3 text
        cy.get('h3')
        .contains(data.dynamicContent);

        // Check content row 1 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(0).should('be.visible');
        cy.percySnapshot('Static Content Row 1');

        // Check content row 2 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(1).should('be.visible');
        cy.percySnapshot('Static Content Row 2');
        
        // Check content row 3 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(2).should('be.visible');
        cy.percySnapshot('Dynamic Content Row 3');
    })
})