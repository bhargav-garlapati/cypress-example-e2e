describe('Google fail search', () => {
    
    it('Successfully loads Google.com', () => {
        cy.visit('https://www.google.com') 
    })

    it('Search for something strange', () => {
        cy.get('[name="q"]')
        .type('telus')
        .should('have.value', 'telus')
        .type('{enter}')
    })

    it('Expect more than 1000 results', () => {
        cy.get('[id="result-stats"]').contains('1000 results')
    })
  })