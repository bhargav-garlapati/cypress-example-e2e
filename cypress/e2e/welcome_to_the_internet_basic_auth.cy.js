describe('Basic Auth Testing', () => {
    
    it('Successfully loads the-internet.herokuapp.com and test basic auth', () => {
        cy.visitPage('/basic_auth');
        cy.get('h3')
        .contains('Basic Auth')
        cy.get('p')
        .contains('Congratulations! You must have the proper credentials');
    })
  })