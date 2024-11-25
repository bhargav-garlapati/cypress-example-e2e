describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    it('File upload test demo', () => {

        // Visit upload page
        cy.visitPage('/upload');

        // Check h3 text
        cy.get('h3')
        .contains(data.fileUploader);

        // Upload file
        cy.get("#file-upload").selectFile("cypress/fixtures/content.json");

        // Click on upload button
        cy.get("#file-submit").click();

        // Check h3 text
        cy.get("h3", { timeout: 30000 }).should("have.text","File Uploaded!");

        // Check uploaded file name
        cy.get("#uploaded-files").contains("content.json");
 
    })
})