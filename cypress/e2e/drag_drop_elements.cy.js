describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Drag and Drop elements', () => {

        // Visit login page
        cy.visitPage('/drag_and_drop');

        // Check h3 text
        cy.get('h3')
        .contains(data.dragDrop);

        // Drag and Drop elements
        cy.dragAndDrop('#column-a', '#column-b');
    })

})