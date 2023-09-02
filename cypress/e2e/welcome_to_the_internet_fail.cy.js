describe('Welcome to the-internet', () => {
    
    it('Successfully loads the-internet page: Fail assertion', () => {
        cy.visitPage('/');
        cy.get('h1')
        .contains('Welcome to the not-internet');
        // cy.get('[name="q"]').compareSnapshot('googleTest', 0.2, { limit: 6, delay: 1000 });
    })
  })