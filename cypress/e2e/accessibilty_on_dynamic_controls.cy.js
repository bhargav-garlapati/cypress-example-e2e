describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Accessibility on dynamic_controls h4 tag - Pass', 
       { tags: ['accessibility', 'ui'] }, 
       () => {

        // Visit dynamicControls page
        cy.visitPage('/dynamic_controls');

        // Check h3 text
        cy.get('h4')
        .contains(data.dynamicControls);
        
        // Inject axe-core and check accessibility
        // This will pass
        cy.injectAxe()
        cy.checkA11y('h4', {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa'],
            },
        });
    })

    it('Accessibility on dynamic_controls on p tag - Pass', 
       { tags: ['accessibility', 'ui'] }, 
       () => {

        // Visit dynamicControls page
        cy.visitPage('/dynamic_controls');

        // Check h3 text
        cy.get('h4')
        .contains(data.dynamicControls);
        
        // Inject axe-core and check accessibility
        // This will pass
        cy.injectAxe()
        cy.checkA11y('p', {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa'],
            },
        });

    })

    it.skip('Accessibility on dynamic_controls on form - Fail', 
       { tags: ['accessibility', 'form'] }, 
       () => {

        // Visit dynamicControls page
        cy.visitPage('/dynamic_controls');

        // Check h3 text
        cy.get('h4')
        .contains(data.dynamicControls);
        
        // This will fail
        cy.checkA11y('form', {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa'],
            },
        });

    })

})
