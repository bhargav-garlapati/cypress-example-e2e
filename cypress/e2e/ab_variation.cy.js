describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('A/B Test Variation', () => {

        // Visit abtest page
        cy.visitPage('/abtest');

        // Check h3 text
        cy.get('body').then(($body) => {
            if ($body.find('h3').text().includes(data.abtest1)) {
                cy.log(data.abtest1);
            } else {
                cy.log(data.abtest2);
            }
        })
    })
})