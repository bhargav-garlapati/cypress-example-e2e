describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('Handle Window Alert', 
       { tags: ['alerts', 'ui'] }, 
       () => {

        // Visit context_menu page
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

    it('Handle jsAlert Alert', 
       { tags: ['alerts', 'ui'] }, 
       () => {

        // Visit javascript_alerts page
        cy.visitPage('/javascript_alerts');

        // Check h3 text
        cy.get('h3')
        .contains(data.javaScriptAlerts);

        // Click on JS Alert button
        cy.get('[onclick="jsAlert()"]').click();
        
        // Check JS Alert text click OK
        cy.on('window:alert', (text) => {
            expect(text).to.equal(`I am a JS Alert`)
            // note: Cypress automatically accepts alerts
        })

        // Check Alert result text
        cy.get('#result').contains('You successfully clicked an alert');
    })

    it('Handle jsConfirm Alert', 
       { tags: ['alerts', 'ui'] }, 
       () => {

        // Visit javascript_alerts page
        cy.visitPage('/javascript_alerts');

        // Check h3 text
        cy.get('h3')
        .contains(data.javaScriptAlerts);

        // Click on JS Confirm button
        cy.get('[onclick="jsConfirm()"]').click();
        
        // Check JS Alert text click OK
        cy.on('window:alert', (text) => {
            expect(text).to.equal(`I am a JS Confirm`)
            // note: Cypress automatically accepts alerts
        })

        // Check Alert result text
        cy.get('#result').contains('You clicked: Ok');
    })

    it('Handle jsPrompt Alert and enter data', 
       { tags: ['alerts', 'data-entry'] }, 
       () => {

        // Visit javascript_alerts page
        cy.visitPage('/javascript_alerts');

        // Check h3 text
        cy.get('h3')
        .contains(data.javaScriptAlerts);

        cy.window().then((win) => {

            //stub the prompt window
            cy.stub(win, "prompt").returns("Prompt test");

            // click on Click for JS Prompt button
            cy.get("[onclick='jsPrompt()']").click();

            // Check Alert result text
            cy.get('#result').contains('You entered: Prompt test')
         });

    })
})
