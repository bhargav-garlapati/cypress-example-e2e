// This script uses LambdaTest SmartUI Cypress SDK and LambdaTest Cypress CLI to run the tests using dynamic content on the-internet.herokuapp.com.
// To setup at the LambdaTest dasboard 
// Step 1: https://smartui.lambdatest.com/projects, 
// Step 2: Create new project, Select CLI option
// Step 3: Create new project name and continue
// Step 4: Follow the instructions to install the LambdaTest CLI and run the tests


describe('Welcome to the-internet', () => {
    const data = require('../../fixtures/content.json');

    it('UI Test using Dynamic content 1', 
       { tags: ['visual-testing', 'smartui'] }, 
       () => {

        // Visit dynamic_content page
        cy.visitPage('/dynamic_content?with_content=static');

        // Check h3 text
        cy.get('h3')
        .contains(data.dynamicContent);

        // Check content row 1 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(1).should('be.visible');
        cy.smartuiSnapshot('Row-1', {
            element: {
                cssSelector: '[id="content"] > .row:nth-of-type(1)',
            }
        });

        // Check content row 2 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(2).should('be.visible');
        cy.smartuiSnapshot('Row-2', {
            element: {
                cssSelector: '[id="content"] > .row:nth-of-type(2)',
            }
        });
        
        // Check content row 3 and take snapshot
        cy.get('[id="content"] [class="row"]').eq(3).should('be.visible');
        cy.smartuiSnapshot('Row-3', {
            element: {
                cssSelector: '[id="content"] > .row:nth-of-type(3)',
            }
        });
    })
})
