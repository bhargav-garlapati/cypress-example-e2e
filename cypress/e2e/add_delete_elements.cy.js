describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Add and Remove elements on the page', () => {

        let times = 7;
        // Visit add_remove_elements page
        cy.visitPage('/add_remove_elements/');

        cy.get('h3')
        .contains(data.addRemoveElements);

        // Click Add Element button 7 times 
       for (let i = 0; i < times; i++) {
            cy.get('[onclick="addElement()"]').click();
        }

        // Click Delete Element button 7 times
        for (let i = 0; i < times; i++) {
            cy.get('[onclick="deleteElement()"]').first().click();
        }

    })
})