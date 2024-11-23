describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Handle JS Alert', () => {

        // Visit login page
        cy.visitPage('/context_menu');

        // Check h3 text
        cy.get('h3')
        .contains(data.contextMenu);

        // Check checkbox1 is not checked
        cy.get('[id="hot-spot"]').rightclick('center');
        
        // Check JS Alert text
        cy.on('window:alert', (text) => {
            expect(text).to.equal(`You selected a context menu`)
        })
    })
})