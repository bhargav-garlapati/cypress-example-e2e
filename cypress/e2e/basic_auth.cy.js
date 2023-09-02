describe('Basic Auth using Vercel.app', () => {
    
    it('Successfully loads Vercel.app', () => {
        cy.visitPage('/');
    })

    it('Password-protected page demo', () => {
        cy.get('h2')
        .contains('Password-protected page demo');
    })
  })