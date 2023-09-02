describe('Basic Auth Testing', () => {
    
    it('Successfully loads the-internet.herokuapp.com and test basic auth', () => {
        if (Cypress.env('ENV') === 'production') {
            cy.visitPage('/basic_auth');
        } else {
            cy.visitPage('/');
        }
        cy.get('h3')
        .contains('Basic Auth')
        cy.get('p')
        .contains('Congratulations! You must have the proper credentials');
    })
  })